# CryptoZombies DApp Setup Guide

## Detailed Step-by-Step Setup Instructions

### Phase 1: Environment Preparation

#### 1.1 Verify Prerequisites
- **Node.js**: Version 14 or higher
- **npm**: Comes with Node.js installation
- **Git**: For version control (optional but recommended)

#### 1.2 Install Global Dependencies
```bash
# Install Truffle globally
npm install -g truffle

# Verify installation
truffle version
```

#### 1.3 Install Ganache
**Option A - GUI Version (Recommended):**
- Download from: https://trufflesuite.com/ganache/
- Install and launch the application

**Option B - CLI Version:**
```bash
npm install -g ganache-cli
```

### Phase 2: Project Setup

#### 2.1 Install Project Dependencies
```bash
cd "/path/to/Cryptozombie demo package"
npm install
```

Expected output should show installation of:
- web3: ^1.6.1
- openzeppelin-solidity: ^4.4.1
- truffle-hdwallet-provider: ^1.0.17
- browser-sync: ^2.27.7

#### 2.2 Verify Project Structure
Ensure the following files and directories exist:
- contracts/ (contains .sol files)
- migrations/ (contains deployment scripts)
- test/ (contains test files)
- index.html (frontend interface)
- cryptozombies_abi.js (contract ABI)
- package.json (dependencies)
- truffle-config.js (Truffle configuration)

### Phase 3: Blockchain Configuration

#### 3.1 Start Ganache
**GUI Method:**
1. Open Ganache GUI
2. Click "Quickstart"
3. Note the following details:
   - RPC Server: http://127.0.0.1:7545
   - Network ID: 5777 (or note the actual ID shown)
   - Account addresses and private keys

**CLI Method:**
```bash
ganache-cli --port 7545 --network-id 5777
```

#### 3.2 Update Truffle Configuration
Edit `truffle-config.js` to match your Ganache settings:
```javascript
development: {
  host: "127.0.0.1",
  port: 7545,
  network_id: "5777", // Update this to match your Ganache Network ID
},
```

### Phase 4: Smart Contract Deployment

#### 4.1 Compile Contracts
```bash
truffle compile
```

Expected output:
- All .sol files compiled successfully
- Artifacts written to build/contracts/

#### 4.2 Deploy Contracts
```bash
truffle migrate --network development
```

Expected output:
- Migration 1: Deploy Migrations contract
- Migration 2: Deploy all zombie contracts
- Note the contract addresses, especially ZombieOwnership

#### 4.3 Verify Deployment
Check Ganache GUI:
- Should show multiple transactions
- Account balance should be reduced (gas fees)
- Contracts should appear in CONTRACTS tab

### Phase 5: Frontend Configuration

#### 5.1 Update Contract Address
In `index.html`, locate line 34:
```javascript
var cryptoZombiesAddress = "0xC934e804e4Bb09960AD3dE5c959997Ff82f038Ed";
```

Replace with the actual ZombieOwnership contract address from deployment output.

#### 5.2 Configure MetaMask
1. Install MetaMask browser extension
2. Create new account or import existing
3. Add custom network:
   - Network Name: "Ganache Local"
   - RPC URL: "http://127.0.0.1:7545"
   - Chain ID: "5777"
   - Currency Symbol: "ETH"
4. Import Ganache account:
   - Click account icon in Ganache
   - Copy private key
   - In MetaMask: Import Account > Paste private key

### Phase 6: Frontend Server Setup

#### 6.1 Start Development Server
```bash
npx browser-sync start --server --files "*.html,*.js" --port 8080
```

Alternative methods:
```bash
# Using Python
python3 -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080
```

#### 6.2 Access the Application
1. Open browser
2. Navigate to: http://localhost:8080
3. Connect MetaMask when prompted
4. Verify connection to correct network

### Phase 7: Testing and Verification

#### 7.1 Test Basic Functionality
1. **Create Zombie:**
   - Click "Create Zombie" button
   - Confirm transaction in MetaMask
   - Wait for confirmation

2. **View Zombies:**
   - Click "Show Zombies" button
   - Verify zombie details are displayed

3. **Level Up:**
   - Click "Level Up" button
   - Confirm transaction (0.001 ETH cost)
   - Verify level increase

#### 7.2 Run Automated Tests
```bash
truffle test
```

Expected output:
- All tests should pass
- No compilation errors
- Contract interactions verified

### Phase 8: Troubleshooting Common Issues

#### 8.1 Network Connection Issues
**Problem:** "Network id mismatch"
**Solution:**
- Verify Ganache Network ID matches truffle-config.js
- Restart Ganache if necessary
- Check port 7545 is not occupied

**Problem:** "Cannot connect to network"
**Solution:**
- Ensure Ganache is running
- Check firewall settings
- Verify RPC URL in MetaMask

#### 8.2 Contract Deployment Issues
**Problem:** "Contract not deployed"
**Solution:**
- Check deployment output for errors
- Verify sufficient ETH in deploying account
- Re-run migration: `truffle migrate --reset --network development`

**Problem:** "Invalid contract address"
**Solution:**
- Update contract address in index.html
- Verify address from deployment output
- Ensure no typos in address

#### 8.3 Frontend Issues
**Problem:** "Cannot connect to MetaMask"
**Solution:**
- Ensure MetaMask is installed and unlocked
- Check network configuration in MetaMask
- Refresh page and reconnect

**Problem:** "Transaction failed"
**Solution:**
- Check ETH balance in MetaMask
- Increase gas limit if necessary
- Verify contract is properly deployed

#### 8.4 Performance Issues
**Problem:** Slow transaction processing
**Solution:**
- Check Ganache performance settings
- Increase gas price if needed
- Ensure stable network connection

### Phase 9: Production Considerations

#### 9.1 Security Measures
- Never use real ETH on test networks
- Keep private keys secure
- Use environment variables for sensitive data
- Implement proper access controls

#### 9.2 Optimization
- Minimize gas usage in smart contracts
- Optimize frontend loading times
- Implement proper error handling
- Add loading indicators for transactions

#### 9.3 Monitoring
- Monitor transaction success rates
- Track gas usage patterns
- Implement logging for debugging
- Set up alerts for failures

### Verification Checklist

Before considering setup complete, verify:

- [ ] Ganache is running and accessible
- [ ] All contracts compiled without errors
- [ ] Contracts deployed successfully
- [ ] Contract address updated in frontend
- [ ] MetaMask configured and connected
- [ ] Frontend server running on port 8080
- [ ] DApp accessible in browser
- [ ] Can create zombie successfully
- [ ] Can view zombie details
- [ ] Can level up zombie
- [ ] All tests pass
- [ ] No console errors in browser

### Support and Resources

- **Truffle Documentation:** https://trufflesuite.com/docs/
- **Ganache Documentation:** https://trufflesuite.com/docs/ganache/
- **Web3.js Documentation:** https://web3js.readthedocs.io/
- **MetaMask Documentation:** https://docs.metamask.io/
- **Solidity Documentation:** https://docs.soliditylang.org/

### Final Notes

This setup guide provides comprehensive instructions for running the CryptoZombies DApp locally. The application is designed for educational purposes and demonstrates key blockchain development concepts including smart contract deployment, frontend integration, and user interaction with decentralized applications.

For production deployment, additional considerations including security audits, gas optimization, and user experience enhancements would be necessary.
