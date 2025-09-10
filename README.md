# LinkedCreds - Business

A secure and efficient platform for creating, managing, and sharing verifiable professional credentials. Built for businesses to showcase Learning and Employment Records (LERs) that are compliant with W3C Verifiable Credential standards.

## 🌟 Project Overview

LinkedCreds - Business is a Next.js web application that enables organizations to create, validate, and share verifiable credentials for their employees. The platform supports various types of credentials including:

- **Employment Records** - Document job roles and responsibilities
- **Performance Reviews** - Collaborative performance evaluations
- **Skills & Competencies** - Professional skills with supervisor endorsements
- **Volunteer Work** - Community service and volunteer activities
- **Identity Verification** - Notarized identity verification (coming soon)

### Key Features

- ✅ **Verifiable** - W3C Verifiable Credential compliant
- ✅ **Shareable** - Easy sharing with stakeholders
- ✅ **Tamper-proof** - Cryptographically secure
- ✅ **Beautiful Presentation** - Professional visual design
- ✅ **User Ownership** - Credentials owned by the recipient
- ✅ **Access Control** - Users control who can view their credentials
- ✅ **No Degree Required** - Focus on skills and experience

### Technology Stack

- **Frontend**: Next.js 14 with React 18, TypeScript
- **UI Framework**: Material-UI (MUI) with Emotion styling
- **Authentication**: NextAuth.js with Google OAuth
- **Storage**: Google Drive integration for credential storage
- **Blockchain**: Ethereum integration with ethers.js
- **Email**: SendGrid and Nodemailer for notifications
- **File Processing**: PDF.js, Excel processing, QR code generation
- **Development**: ESLint, Prettier, TypeScript

## 🚀 Setup Instructions for New Developers

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- Google Cloud Platform account (for OAuth and Drive API)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Cooperation-org/Linked-Creds-Author-Businees-Enhancement.git
cd Linked-Creds-Author-Businees-Enhancement
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory based on `example.env`:

```bash
cp example.env .env.local
```

Configure the following environment variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Additional environment variables may be required
# Check example.env for the complete list
```

### 4. Google Cloud Platform Setup

1. Create a new project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Google Drive API
   - Google+ API (for OAuth)
3. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Set authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret to your `.env.local`

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Code Formatting and Linting

The project includes automated code formatting:

```bash
# Format code
npm run format

# Run linter
npm run lint
```

## 🤝 Contribution Guidelines

We welcome contributions from the community! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### Coding Standards

- **TypeScript**: All new code should be written in TypeScript
- **Formatting**: Use Prettier for code formatting (`npm run format`)
- **Linting**: Ensure ESLint passes (`npm run lint`)
- **Components**: Follow React functional component patterns with hooks
- **Styling**: Use Material-UI components and emotion for styling
- **File Structure**: Follow the existing app directory structure

### Pull Request Process

1. Ensure your PR description clearly describes the problem and solution
2. Include screenshots for UI changes
3. Update documentation if necessary
4. Ensure all tests pass and add new tests for new features
5. Request review from maintainers
6. Address any feedback promptly

### Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Accessibility considerations are addressed
- [ ] Performance implications are considered
- [ ] Security best practices are followed

### Issue Reporting

When reporting issues:

1. Use a clear, descriptive title
2. Provide steps to reproduce the problem
3. Include browser/environment information
4. Add screenshots if applicable
5. Check if the issue already exists before creating a new one

## 🔒 Security

- All authentication is handled through Google OAuth 2.0
- Credentials are stored securely in users' Google Drive
- No personal data is stored on our servers
- All data transmissions use encrypted HTTPS connections
- Regular security audits are conducted

For security concerns, please email the maintainers directly rather than creating public issues.

## 📄 License Information

© 2024 US Chamber of Commerce Foundation

This project is developed by the [T3 Innovation Network](https://t3networkhub.org), a network of leading organizations committed to open infrastructure for Learning and Employment Records.

### Open Source License

This project is open source and available under the terms specified in the LICENSE file. The T3 Innovation Network promotes open infrastructure for credential management and verifiable credentials.

### Third-Party Licenses

This project uses various open-source libraries and services:

- Next.js - MIT License
- React - MIT License
- Material-UI - MIT License
- NextAuth.js - ISC License
- And other dependencies listed in `package.json`

### Usage Rights

- ✅ Commercial use permitted
- ✅ Modification permitted
- ✅ Distribution permitted
- ✅ Private use permitted

### Attribution

When using or modifying this software, please maintain attribution to:

- US Chamber of Commerce Foundation
- T3 Innovation Network
- Original contributors

## 🔗 Related Links

- **Live Application**: [https://linked-creds-author-businees-enhancement.vercel.app/](https://linked-creds-author-businees-enhancement.vercel.app/)
- **T3 Innovation Network**: [https://t3networkhub.org](https://t3networkhub.org)
- **GitHub Organization**: [https://github.com/Cooperation-org](https://github.com/Cooperation-org)
- **LinkedIn**: [https://linkedin.com/company/linkedtrust/](https://linkedin.com/company/linkedtrust/)

## 📞 Support

- **Documentation**: Check the `/help` route in the application
- **Issues**: Create an issue in this repository
- **Community**: Join discussions in the T3 Innovation Network

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable React components
│   ├── utils/             # Utility functions
│   ├── firebase/          # Firebase configuration
│   ├── hooks/             # Custom React hooks
│   └── [formType]/        # Dynamic credential form routes
├── public/                # Static assets
├── .github/              # GitHub workflows and templates
└── docs/                 # Additional documentation
```

---

**Built with ❤️ by the T3 Innovation Network for the future of verifiable credentials.**
