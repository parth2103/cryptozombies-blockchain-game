# CryptoZombies DApp - Midterm Project

## Project Overview

This is a complete Ethereum Decentralized Application (DApp) that implements a zombie collection and battle game using smart contracts. The DApp consists of backend smart contracts written in Solidity and a frontend web interface using Web3.js for blockchain interaction.

## Features

### Core Features
- **Zombie Creation**: Create unique zombies with random DNA and custom names
- **Visual Representation**: DNA-based zombie avatar generation using SVG
- **Zombie Management**: View zombie stats with professional card-based layout
- **Level Up System**: Pay ETH to increase zombie levels with visual feedback
- **Rarity System**: Zombie rarity based on DNA uniqueness (Common to Legendary)
- **NFT Ownership**: ERC721-compliant non-fungible token ownership

### Advanced Features
- **Feed on Kitty**: Integrate with CryptoKitties to create hybrid zombies
- **Attack System**: Battle zombies against each other with win/loss tracking
- **Transfer System**: Send zombies to other addresses
- **Name Changes**: Rename zombies (requires level 2+)
- **Real-time Events**: Live blockchain event monitoring and updates
- **Cooldown System**: Visual indicators for zombie readiness

### Professional UI/UX
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Dark Theme**: Professional zombie apocalypse aesthetic
- **Modal System**: Clean user input dialogs for all actions
- **Loading States**: Progress indicators and feedback for all operations
- **Error Handling**: Comprehensive error messages and validation
- **Wallet Integration**: Seamless MetaMask connection and management

## Technical Architecture

### Smart Contracts
- **ZombieFactory**: Core contract for zombie creation and management
- **ZombieOwnership**: ERC721 implementation for NFT ownership
- **ZombieAttack**: Battle system implementation
- **ZombieFeeding**: Feeding mechanics for zombie enhancement
- **ZombieHelper**: Additional utility functions
- **SafeMath**: Security library for mathematical operations
- **Ownable**: Access control implementation

### Frontend
- **HTML Interface**: Clean, functional user interface
- **Web3.js Integration**: Blockchain connectivity and interaction
- **MetaMask Integration**: Wallet connection and transaction signing
- **Real-time Updates**: Event-driven UI updates

## Prerequisites

Before running the DApp, ensure you have the following installed:

1. **Node.js** (v14 or higher)
2. **npm** (comes with Node.js)
3. **Truffle Framework** (globally): `npm install -g truffle`
4. **Ganache GUI** or **ganache-cli**
5. **MetaMask** browser extension

## Installation and Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- web3: ^1.6.1
- openzeppelin-solidity: ^4.4.1
- truffle-hdwallet-provider: ^1.0.17
- browser-sync: ^2.27.7

### 2. Start Local Blockchain (Ganache)

**Option A - Ganache GUI (Recommended):**
1. Open Ganache GUI application
2. Click "Quickstart" to create a new workspace
3. Note the RPC Server URL (default: http://127.0.0.1:7545)
4. Note the Network ID (default: 5777)

**Option B - Ganache CLI:**
```bash
ganache-cli --port 7545 --network-id 5777
```

### 3. Configure Truffle

The `truffle-config.js` file is configured for the development network:
- Host: 127.0.0.1
- Port: 7545
- Network ID: 5777

### 4. Compile and Deploy Smart Contracts

```bash
# Compile contracts
truffle compile

# Deploy to local network
truffle migrate --network development
```

After successful deployment, note the contract addresses from the output, particularly the ZombieOwnership contract address.

### 5. Update Frontend Configuration

Update the contract address in `index.html`:
```javascript
var cryptoZombiesAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 6. Configure MetaMask

1. Install MetaMask browser extension
2. Create or import an account
3. Add custom network:
   - Network Name: Ganache Local
   - RPC URL: http://127.0.0.1:7545
   - Chain ID: 5777
   - Currency Symbol: ETH
4. Import one of Ganache's accounts using its private key

### 7. Start Frontend Server

```bash
npx browser-sync start --server --files "*.html,*.js" --port 8080
```

### 8. Access the DApp

Open your browser and navigate to `http://localhost:8080`

## Usage

### Creating Your First Zombie
1. Connect MetaMask to the DApp
2. Click "Create Zombie" button
3. Wait for transaction confirmation
4. Your zombie will appear with unique DNA

### Viewing Zombies
1. Click "Show Zombies" to display all owned zombies
2. View zombie statistics including name, DNA, level, wins, and losses

### Leveling Up Zombies
1. Select a zombie to level up
2. Click "Level Up" button
3. Confirm the transaction (costs 0.001 ETH)
4. Zombie level will increase

## Project Structure

```
Cryptozombie demo package/
├── contracts/                 # Smart contract source files
│   ├── erc721.sol            # ERC721 token standard
│   ├── ownable.sol           # Access control
│   ├── safemath.sol          # Safe math operations
│   ├── zombiefactory.sol     # Core zombie creation
│   ├── zombieownership.sol   # NFT ownership
│   ├── zombieattack.sol      # Battle system
│   ├── zombiefeeding.sol     # Feeding mechanics
│   └── zombiehelper.sol      # Utility functions
├── migrations/               # Deployment scripts
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
├── test/                     # Test files
│   ├── CryptoZombies.js      # Main test suite
│   └── helpers/              # Test utilities
├── build/                    # Compiled contract artifacts
├── index.html                # Frontend interface
├── cryptozombies_abi.js      # Contract ABI
├── package.json              # Dependencies
├── truffle-config.js         # Truffle configuration
└── README.md                 # This documentation
```

## Smart Contract Details

### ZombieFactory
- Creates new zombies with random DNA
- Manages zombie ownership mapping
- Emits NewZombie events

### ZombieOwnership
- Implements ERC721 standard
- Handles zombie transfers
- Manages approvals and ownership

### ZombieAttack
- Implements battle mechanics
- Manages win/loss tracking
- Handles cooldown periods

## Testing

Run the test suite to verify contract functionality:

```bash
truffle test
```

The test suite includes:
- Zombie creation tests
- Ownership transfer tests
- Battle system tests

## Troubleshooting

### Common Issues

1. **Network ID Mismatch**
   - Ensure Ganache Network ID matches truffle-config.js (5777)
   - Restart Ganache if necessary

2. **Contract Address Not Found**
   - Verify contract deployment was successful
   - Update contract address in index.html

3. **MetaMask Connection Issues**
   - Ensure MetaMask is on the correct network
   - Check that account has sufficient ETH

4. **Transaction Failures**
   - Verify sufficient ETH balance
   - Check gas limits and prices
   - Ensure contracts are properly deployed

### Error Messages

- "Cannot find module" errors: Run `npm install`
- "Network id mismatch": Check Ganache and truffle-config.js settings
- "Contract not deployed": Run `truffle migrate --network development`

## Security Considerations

- This is a demonstration project for educational purposes
- Smart contracts use SafeMath for arithmetic operations
- Access control implemented through Ownable pattern
- All transactions require proper authorization

## Future Enhancements

Potential improvements for production deployment:
- Enhanced UI/UX design
- Additional zombie attributes and abilities
- Battle animations and effects
- Marketplace for zombie trading
- Mobile-responsive design
- Gas optimization

## License

This project is for educational purposes as part of CPSC 559 - Advanced Blockchain Technologies coursework.

## Contact

For questions or issues related to this project, please refer to the course materials or instructor.
