# Supply Chain Blockchain POC

## **Demo**

https://github.com/user-attachments/assets/e0a68003-c17a-444c-8df9-efc2c0f11d6e

---

## **Table of Contents**
- [Introduction](#introduction)
- [Project Objectives](#project-objectives)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Smart Contracts](#smart-contracts)
- [Running Tests](#running-tests)
- [Future Work](#future-work)
- [Contributors](#contributors)
- [License](#license)

## **Introduction**
Welcome to the Supply Chain Blockchain Proof of Concept (POC) project. This project demonstrates how blockchain technology can enhance supply chain processes by improving traceability, preventing fraud, optimizing information flow, reducing costs and delays, ensuring security, and automating routine tasks through smart contracts.

## **Project Objectives**
The primary objective of this POC is to create a blockchain system that allows manufacturers, suppliers, logistics providers, and retailers to:
- **Track Products' Journey:** Monitor products from their origin to end consumers.
- **Verify Authenticity:** Ensure that products are genuine and free from counterfeits.
- **Automate Processes:** Utilize smart contracts to automate status updates and other routine tasks.

## **Project Structure**
The project is organized into the following directories and files:

```
poc_blockchain/
├── contracts/
│   ├── SupplyChain.sol
│   └── Migrations.sol
├── migrations/
│   ├── 1_initial_migration.js
│   └── 3_deploy_supplychain.js
├── supply-chain/
│   ├── components/
│   ├── pages/
│   └── utils/
├── test/
│   └── supplyChainTests.js
├── build/
│   └── contracts/
│       └── SupplyChain.json
├── package.json
├── truffle-config.js
└── README.md
```

- **contracts/**: Contains Solidity smart contracts.
  - `SupplyChain.sol`: Main smart contract managing the supply chain.
  - `Migrations.sol`: Handles contract migrations.
  
- **migrations/**: Deployment scripts for smart contracts.
  - `1_initial_migration.js`: Deploys the Migrations contract.
  - `3_deploy_supplychain.js`: Deploys the SupplyChain contract.
  
- **src/**: Placeholder for frontend UI components (to be developed).
  - `components/`: Reusable React components.
  - `pages/`: Next.js pages.
  - `utils/`: Utility functions and configurations.
  
- **test/**: Contains JavaScript test files for smart contracts.
  - `supplyChainTests.js`: Test suite for the SupplyChain contract.
  
- **build/**: Compiled contract artifacts.
  
- **package.json**: Project dependencies and scripts.
  
- **truffle-config.js**: Truffle configuration for network settings and compiler versions.
  
- **README.md**: Project documentation.

## **Technologies Used**
- **Blockchain Platform**: Ethereum (using Truffle framework)
- **Smart Contracts**: Solidity, OpenZeppelin Contracts
- **Development Framework**: Truffle
- **Frontend**: Next.js, React
- **Programming Languages**: JavaScript, Solidity
- **Testing**: Mocha, Chai, OpenZeppelin Test Helpers
- **Version Control**: Git
- **Containerization**: Docker (planned)
- **Database**: MongoDB or PostgreSQL (planned)

## **Setup Instructions**

### **Prerequisites**
- **Node.js** (v14.x or later)
- **npm** (v6.x or later)
- **Truffle**: Install globally using `npm install -g truffle`
- **Ganache**: For local Ethereum blockchain simulation
- **Git**: For version control

### **Installation Steps**
1. **Clone the Repository**
   ```bash
   git clone https://github.com/beltranbulbarella/poc_blockchain.git
   cd poc_blockchain
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npm i truffle
   ```

3. **Compile Smart Contracts**
   ```bash
   truffle compile
   ```

4. **Deploy Smart Contracts to Local Network**
    - Start Ganache and ensure it's running on the default port `7545`.
    ```bash
    garnache-cli
    ```
   -  To use the same wallets use the mnemonic tag
    ```bash
    ganache-cli --mnemonic "crane earth decrease march gas income hold debate powder salt spider discover"
    ```
   
    - Deploy contracts:
    ```bash
    truffle migrate --reset
   truffle exec scripts/addProducts.js
      ```

## **Smart Contracts**
### **SupplyChain.sol**
The `SupplyChain` smart contract manages the creation and tracking of products through various stages in the supply chain. It employs role-based access control to ensure that only authorized parties can perform specific actions.

#### **Key Features:**
- **Role-Based Access Control:** Defines roles such as Supplier, Manufacturer, Logistics Provider, Retailer, and Consumer.
- **Product Management:** Allows suppliers to create products and authorized roles to update product statuses.
- **Traceability:** Maintains a history of all status updates for each product.
- **Events:** Emits events for product creation and status updates to facilitate frontend tracking.

### **Migrations.sol**
Handles the deployment and migration of smart contracts.

## **Running Tests**
Ensure that Ganache is running on port `7545` before executing tests.

1. **Compile Contracts**
   ```bash
   truffle compile
   ```

2. **Migrate Contracts**
   ```bash
   truffle migrate --reset
   ```

3. **Run Test Suite**
   ```bash
   truffle test
   ```

### **Test Cases:**
- **Role Assignments:** Verifies that only authorized accounts can perform specific actions.
- **Product Creation:** Ensures suppliers can create products and prevents duplicate creations.
- **Status Updates:** Confirms that only authorized roles can update product statuses.
- **Product Retrieval:** Allows consumers to fetch product details and history.
- **Event Emissions:** Checks that relevant events are emitted during contract interactions.

## **Future Work**
- **Frontend Development:** Implement the user interface using Next.js and React under the `/src` directory.
- **Database Integration:** Set up a database (MongoDB/PostgreSQL) to store off-chain data and enhance data retrieval performance.
- **Authentication and Authorization:** Integrate secure authentication mechanisms for different stakeholders.
- **Deployment:** Prepare the application for deployment on cloud platforms and manage blockchain nodes using Docker or Kubernetes.
- **Additional Features:** Implement QR code generation for products, real-time tracking dashboards, and enhanced security measures.

[//]: # (## **Contributors**)
[//]: # (- **Your Name** - [your-email@example.com]&#40;mailto:your-email@example.com&#41;)
[//]: # (- **Team Member 1** - [email1@example.com]&#40;mailto:email1@example.com&#41;)
[//]: # (- **Team Member 2** - [email2@example.com]&#40;mailto:email2@example.com&#41;)

## **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
