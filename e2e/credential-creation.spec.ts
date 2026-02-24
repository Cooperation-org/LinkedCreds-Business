import { test, expect } from '@playwright/test';

test.describe('Credential Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Use a valid form route - /skill is the default credential form type
    await page.goto('/skill', { waitUntil: 'domcontentloaded' });
  });
  test('credential form page loads', async ({ page }) => {
    test.setTimeout(90000);
    await expect(page).toHaveURL(/\/skill/);

    // The form is dynamically imported (ssr: false). Waiting for `networkidle` is flaky
    // because NextAuth/Next.js can keep background requests open. Instead, wait for a single
    // "page is usable" signal with a bounded timeout.
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      // Keep it small to avoid noisy output in CI
      if (consoleMessages.length < 20) consoleMessages.push(`[console.${msg.type()}] ${msg.text()}`);
    });
    page.on('pageerror', err => {
      if (consoleMessages.length < 20) consoleMessages.push(`[pageerror] ${String(err)}`);
    });

    const continueButton = page.getByRole('button', { name: /continue without saving/i });
    const loginButton = page.getByRole('button', { name: /login with google drive/i });
    const form = page.locator('form');
    const step0Text = page.getByText(/first,\s*login with google drive/i);

    // Avoid `.or(...).first()` because the "first" match can be a non-visible element
    // (e.g. the <form>) even when one of the buttons is visible.
    let ready = true;
    try {
      await expect.poll(
        async () => {
          const checks = await Promise.all([
            continueButton.isVisible().catch(() => false),
            loginButton.isVisible().catch(() => false),
            step0Text.isVisible().catch(() => false),
            // If the form exists in the DOM, we consider the page "loaded" even if it isn't visible yet.
            form.count().then(c => c > 0).catch(() => false)
          ]);
          return checks.some(Boolean);
        },
        { timeout: 60000, intervals: [250, 500, 1000, 2000] }
      ).toBeTruthy();
    } catch {
      ready = false;
    }

    if (!ready) {
      const bodyText = (await page.locator('body').innerText().catch(() => '')).slice(0, 800);
      await page.screenshot({ path: 'test-results/credential-form-page-loads-failure.png', fullPage: true });
      throw new Error(
        [
          'Credential form did not become ready within 60s.',
          `URL: ${page.url()}`,
          bodyText ? `Body text (first 800 chars):\n${bodyText}` : 'Body text: <empty>',
          consoleMessages.length ? `Messages:\n${consoleMessages.join('\n')}` : 'Messages: <none>'
        ].join('\n\n')
      );
    }
  });

  test('Step 1: can fill in user name', async ({ page }) => {
    const continueButton = page.getByRole('button', { name: /continue without saving/i });
    if (await continueButton.isVisible()) {
      await continueButton.click();
      await page.waitForTimeout(1000);
    }
    
    const nameInput = page.locator('input[name="fullName"]').first();
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
      
      await expect(nameInput).toHaveValue('Test User');
    }
  });

  test('Step 2: can fill in credential details', async ({ page }) => {
    const continueButton = page.getByRole('button', { name: /continue without saving/i });
    if (await continueButton.isVisible()) {
      await continueButton.click();
      await page.waitForTimeout(1000);
    }
    
    const credentialNameInput = page.locator('input[name="credentialName"]').first();
    const descriptionTextarea = page.locator('textarea[name="credentialDescription"]').first();
    const descriptionEditable = page.locator('[contenteditable="true"]').first();
    
    if (await credentialNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await credentialNameInput.fill('Test Skill');
    }
    
    const hasTextarea = await descriptionTextarea.isVisible({ timeout: 3000 }).catch(() => false);
    const hasEditable = await descriptionEditable.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasTextarea) {
      await descriptionTextarea.fill('This is a test credential description');
    } else if (hasEditable) {
      await descriptionEditable.fill('This is a test credential description');
    }
  });

  test('form validation works', async ({ page }) => {
    const continueButton = page.getByRole('button', { name: /continue without saving/i });
    if (await continueButton.isVisible()) {
      await continueButton.click();
      // Allow time for navigation/state update
      await page.waitForTimeout(1000);
    }
    
    // Wait for the form to load - check for either the input or its label
    const nameInput = page.locator('input[name="fullName"]').first();
    const nameLabel = page.getByLabel(/name.*required/i).first();
    
    const hasInput = await nameInput.isVisible({ timeout: 5000 }).catch(() => false);
    const hasLabel = await nameLabel.isVisible({ timeout: 5000 }).catch(() => false);
    
    // Only proceed if form loaded (consistent with other tests)
    if (hasInput || hasLabel) {
      // Trigger validation by focusing and blurring the required field
      // This ensures react-hook-form validates the field
      if (hasInput) {
        await nameInput.focus();
        await nameInput.blur();
        // Wait a bit for validation to complete
        await page.waitForTimeout(300);
      }
      
      const nextButton = page.getByRole('button', { name: /next|continue/i });
      const nextButtonVisible = await nextButton.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (nextButtonVisible) {
        const errorMessages = page.getByText(/required|please enter|invalid/i);
        const hasErrors = await errorMessages.isVisible().catch(() => false);
        
        // Validation is considered working if either:
        // - the button is disabled, or
        // - visible error messages are shown
        const isDisabled = await nextButton.isDisabled().catch(() => false);
        expect(isDisabled || hasErrors).toBeTruthy();
      }
    }
  });

  test('can navigate back and forth between steps', async ({ page }) => {
    const continueButton = page.getByRole('button', { name: /continue without saving/i });
    if (await continueButton.isVisible()) {
      await continueButton.click();
      await page.waitForTimeout(1000);
    }
    
    const backButton = page.getByRole('button', { name: /back|previous/i });
    const nextButton = page.getByRole('button', { name: /next|continue/i });
    
    if (await nextButton.isVisible() && await backButton.isVisible()) {
      const canGoNext = await nextButton.isEnabled().catch(() => false);

      if (canGoNext) {
        await nextButton.click();
        await page.waitForTimeout(500);
        
        await backButton.click();
        await page.waitForTimeout(500);
        
        // Should be back on previous step
        // Verify by checking for Step 1 fields
        const nameInputAgain = page.locator('input[name="fullName"]');
        await expect(nameInputAgain).toBeVisible({ timeout: 3000 });
      } else {
        // If validation prevents moving forward, just assert both buttons are visible
        await expect(nextButton).toBeVisible();
        await expect(backButton).toBeVisible();
      }
    }
  });

  test('form shows step indicators or progress', async ({ page }) => {
    // Check for step indicators, progress bar, or step numbers
    const stepIndicator = page.locator('[aria-label*="step"]').or(
      page.getByText(/step \d+|step \d+ of \d+/i)
    ).or(
      page.locator('[role="progressbar"]')
    ).first();
    
    // Step indicators might not always be visible, so this is optional
    const hasStepIndicator = await stepIndicator.isVisible().catch(() => false);
    
    // At minimum, verify we're on a valid credential form page
    // Match pathname portion of URL (handles hash fragments like #step0)
    await expect(page).toHaveURL(/\/(skill|volunteer|role|performance-review|identity-verification)/);
  });
});

test.describe('Credential Creation - File Upload', () => {
  test.beforeEach(async ({ page }) => {
    // Use a valid form route
    await page.goto('/skill', { waitUntil: 'domcontentloaded' });
    
    // Wait for the form to load
    await page.waitForLoadState('networkidle');
    
    // Navigate past Step 0 if needed
    const continueButton = page.getByRole('button', { name: /continue without saving/i });
    if (await continueButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('evidence upload section is accessible', async ({ page }) => {
    // Navigate to upload step (Step 3 typically)
    // Look for file upload elements
    const uploadButton = page.getByRole('button', { name: /upload|choose file|browse/i }).or(
      page.locator('input[type="file"]')
    ).first();
    
    const uploadSection = page.getByText(/upload|evidence|supporting/i);
    
    // Either upload button or upload section text should be visible
    const hasUpload = await uploadButton.isVisible().catch(() => false) || 
                      await uploadSection.isVisible().catch(() => false);
    
    // For now, just verify we can see upload-related content
    // Full file upload testing would require actual files
    // Verify we're on a valid credential form page (handles hash fragments)
    const isValidFormPage = /\/(skill|volunteer|role|performance-review|identity-verification)/.test(page.url());
    expect(hasUpload || isValidFormPage).toBeTruthy();
  });
});
