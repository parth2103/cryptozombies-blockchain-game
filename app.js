/**
 * CryptoZombies DApp - Enhanced Application Logic
 * Professional interface with modern UX patterns
 */

class CryptoZombiesApp {
    constructor() {
        this.cryptoZombies = null;
        this.userAccount = null;
        this.zombieVisual = new ZombieVisual();
        this.isConnected = false;
        
        // Contract address - will be updated after deployment
        this.contractAddress = "0xC934e804e4Bb09960AD3dE5c959997Ff82f038Ed";
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        await this.setupWeb3();
        this.setupEventListeners();
        this.updateUI();
    }

    /**
     * Setup Web3 connection
     */
    async setupWeb3() {
        try {
            // Check if we're in a modern dapp browser
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access
                    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                    this.userAccount = accounts[0];
                    this.isConnected = true;
                    this.setupContract();
                    this.setupEventListeners();
                } catch (error) {
                    console.error('User denied account access:', error);
                    this.showStatus('Please connect your wallet to use this DApp.', 'warning');
                }
            } else if (window.web3) {
                // Legacy dapp browser
                window.web3 = new Web3(web3.currentProvider);
                this.userAccount = web3.eth.accounts[0];
                this.isConnected = true;
                this.setupContract();
            } else {
                this.showStatus('Please install MetaMask to use this DApp.', 'error');
            }
        } catch (error) {
            console.error('Web3 setup error:', error);
            this.showStatus('Error connecting to blockchain.', 'error');
        }
    }

    /**
     * Setup smart contract instance
     */
    setupContract() {
        try {
            this.cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, this.contractAddress);
            
            // Listen for Transfer events
            this.cryptoZombies.events.Transfer({ filter: { _to: this.userAccount } })
                .on("data", (event) => {
                    this.showStatus('New zombie received!', 'success');
                    this.loadUserZombies();
                })
                .on("error", (error) => {
                    console.error('Event listener error:', error);
                });

            this.showStatus('Smart contract connected successfully!', 'success');
        } catch (error) {
            console.error('Contract setup error:', error);
            this.showStatus('Error connecting to smart contract.', 'error');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // MetaMask account changes
        if (window.ethereum) {
            ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    this.userAccount = accounts[0];
                    this.setupContract();
                    this.loadUserZombies();
                } else {
                    this.userAccount = null;
                    this.isConnected = false;
                    this.updateUI();
                }
            });

            ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }

    /**
     * Connect wallet function
     */
    async connectWallet() {
        if (!window.ethereum) {
            this.showStatus('Please install MetaMask to connect your wallet.', 'error');
            return;
        }

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            this.userAccount = accounts[0];
            this.isConnected = true;
            this.setupContract();
            this.updateUI();
            this.showStatus('Wallet connected successfully!', 'success');
        } catch (error) {
            console.error('Wallet connection error:', error);
            this.showStatus('Failed to connect wallet.', 'error');
        }
    }

    /**
     * Update UI based on connection status
     */
    updateUI() {
        const connectBtn = document.getElementById('connectWalletBtn');
        const accountInfo = document.getElementById('accountInfo');
        const networkStatus = document.getElementById('networkStatus');
        
        if (this.isConnected && this.userAccount) {
            connectBtn.textContent = 'Connected';
            connectBtn.disabled = true;
            connectBtn.classList.add('btn-secondary');
            
            accountInfo.style.display = 'block';
            document.getElementById('accountAddress').textContent = 
                `${this.userAccount.slice(0, 6)}...${this.userAccount.slice(-4)}`;
            
            // Enable action buttons
            document.getElementById('createZombieBtn').disabled = false;
            document.getElementById('showZombiesBtn').disabled = false;
            document.getElementById('feedKittyBtn').disabled = false;
            document.getElementById('attackBtn').disabled = false;
            
            // Update network status
            this.updateNetworkStatus();
            this.loadUserZombies();
        } else {
            connectBtn.textContent = 'Connect Wallet';
            connectBtn.disabled = false;
            connectBtn.classList.remove('btn-secondary');
            
            accountInfo.style.display = 'none';
            networkStatus.innerHTML = '<span>Not Connected</span>';
            
            // Disable action buttons
            document.getElementById('createZombieBtn').disabled = true;
            document.getElementById('showZombiesBtn').disabled = true;
            document.getElementById('feedKittyBtn').disabled = true;
            document.getElementById('attackBtn').disabled = true;
        }
    }

    /**
     * Update network status display
     */
    async updateNetworkStatus() {
        try {
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            const networkName = this.getNetworkName(chainId);
            document.getElementById('networkName').textContent = networkName;
        } catch (error) {
            document.getElementById('networkName').textContent = 'Unknown Network';
        }
    }

    /**
     * Get network name from chain ID
     */
    getNetworkName(chainId) {
        const networks = {
            '0x1': 'Ethereum Mainnet',
            '0x3': 'Ropsten',
            '0x4': 'Rinkeby',
            '0x5': 'Goerli',
            '0xaa36a7': 'Sepolia',
            '0x539': 'Ganache Local',
            '0x1691': 'Ganache Local'
        };
        return networks[chainId] || `Network ${chainId}`;
    }

    /**
     * Show status message
     */
    showStatus(message, type = 'success') {
        const statusElement = document.getElementById('txStatus');
        statusElement.textContent = message;
        statusElement.className = `status-${type}`;
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                statusElement.textContent = 'Ready for action!';
                statusElement.className = 'status-success';
            }, 5000);
        }
    }

    /**
     * Show loading state
     */
    showLoading(buttonId, text = 'Processing...') {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.innerHTML = `<span class="loading-spinner"></span> ${text}`;
        }
    }

    /**
     * Hide loading state
     */
    hideLoading(buttonId, originalText) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    /**
     * Create a new zombie
     */
    async createZombie() {
        const nameInput = document.getElementById('zombieName');
        const name = nameInput.value.trim();
        
        if (!name) {
            this.showStatus('Please enter a zombie name.', 'warning');
            return;
        }

        if (!this.cryptoZombies) {
            this.showStatus('Smart contract not connected.', 'error');
            return;
        }

        try {
            this.showLoading('createZombieConfirmBtn', 'Creating Zombie...');
            this.showStatus('Creating zombie on blockchain...', 'success');

            const result = await this.cryptoZombies.methods.createRandomZombie(name)
                .send({ from: this.userAccount });

            this.showStatus(`Successfully created ${name}!`, 'success');
            this.closeModal('createZombieModal');
            nameInput.value = '';
            
            // Reload zombies
            await this.loadUserZombies();
            
        } catch (error) {
            console.error('Create zombie error:', error);
            this.showStatus(`Error creating zombie: ${error.message}`, 'error');
        } finally {
            this.hideLoading('createZombieConfirmBtn', 'Create Zombie');
        }
    }

    /**
     * Load user's zombies
     */
    async loadUserZombies() {
        if (!this.cryptoZombies || !this.userAccount) {
            return;
        }

        try {
            const zombieIds = await this.cryptoZombies.methods.getZombiesByOwner(this.userAccount).call();
            this.displayZombies(zombieIds);
            this.updateZombieCount(zombieIds.length);
            this.populateZombieSelects(zombieIds);
        } catch (error) {
            console.error('Load zombies error:', error);
            this.showStatus('Error loading zombies.', 'error');
        }
    }

    /**
     * Display zombies in the gallery
     */
    async displayZombies(zombieIds) {
        const zombiesContainer = document.getElementById('zombies');
        zombiesContainer.innerHTML = '';

        if (zombieIds.length === 0) {
            zombiesContainer.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 2rem;">
                    <h3>No zombies yet!</h3>
                    <p>Create your first zombie to start building your army.</p>
                </div>
            `;
            return;
        }

        for (const id of zombieIds) {
            try {
                const zombie = await this.getZombieDetails(id);
                const zombieCard = this.createZombieCard(id, zombie);
                zombiesContainer.appendChild(zombieCard);
            } catch (error) {
                console.error(`Error loading zombie ${id}:`, error);
            }
        }
    }

    /**
     * Get zombie details from contract
     */
    async getZombieDetails(id) {
        return await this.cryptoZombies.methods.zombies(id).call();
    }

    /**
     * Create a zombie card element
     */
    createZombieCard(id, zombie) {
        const rarity = this.zombieVisual.getZombieRarity(zombie.dna);
        const isReady = parseInt(zombie.readyTime) <= Math.floor(Date.now() / 1000);
        
        const card = document.createElement('div');
        card.className = 'zombie-card fade-in';
        
        // Generate zombie avatar
        const avatarSVG = this.zombieVisual.generateZombieSVG(zombie.dna, 200);
        
        card.innerHTML = `
            <div class="zombie-avatar">
                ${avatarSVG}
                ${!isReady ? '<div class="cooldown-overlay">Cooldown Active</div>' : ''}
            </div>
            <ul class="zombie-stats">
                <li><span class="stat-label">Name:</span> <span class="stat-value">${zombie.name}</span></li>
                <li><span class="stat-label">DNA:</span> <span class="stat-value">${zombie.dna}</span></li>
                <li><span class="stat-label">Level:</span> <span class="stat-value">${zombie.level}</span></li>
                <li><span class="stat-label">Wins:</span> <span class="stat-value text-success">${zombie.winCount}</span></li>
                <li><span class="stat-label">Losses:</span> <span class="stat-value text-error">${zombie.lossCount}</span></li>
                <li><span class="stat-label">Rarity:</span> <span class="stat-value" style="color: ${rarity.color}">${rarity.rarity}</span></li>
            </ul>
            <div class="zombie-actions">
                <button class="btn btn-warning" onclick="app.levelUpZombie(${id})" ${!isReady ? 'disabled' : ''}>
                    Level Up (0.001 ETH)
                </button>
                <button class="btn btn-secondary" onclick="app.showTransferModal(${id})">
                    Transfer
                </button>
                ${parseInt(zombie.level) >= 2 ? 
                    `<button class="btn btn-secondary" onclick="app.showChangeNameModal(${id})">Rename</button>` : 
                    ''
                }
            </div>
        `;
        
        return card;
    }

    /**
     * Update zombie count display
     */
    updateZombieCount(count) {
        const countElement = document.getElementById('zombieCount');
        const statsElement = document.getElementById('zombieStats');
        
        if (countElement) countElement.textContent = count;
        if (statsElement) statsElement.style.display = count > 0 ? 'block' : 'none';
    }

    /**
     * Populate zombie select dropdowns
     */
    populateZombieSelects(zombieIds) {
        const selects = ['zombieSelect', 'attackerZombie', 'transferZombie', 'renameZombie'];
        
        for (const selectId of selects) {
            const select = document.getElementById(selectId);
            if (select) {
                // Clear existing options except first
                while (select.children.length > 1) {
                    select.removeChild(select.lastChild);
                }
                
                // Add zombie options
                zombieIds.forEach(async (id) => {
                    try {
                        const zombie = await this.getZombieDetails(id);
                        const option = document.createElement('option');
                        option.value = id;
                        option.textContent = `${zombie.name} (Level ${zombie.level})`;
                        select.appendChild(option);
                    } catch (error) {
                        console.error(`Error loading zombie ${id} for select:`, error);
                    }
                });
            }
        }
    }

    /**
     * Level up a zombie
     */
    async levelUpZombie(zombieId) {
        if (!this.cryptoZombies) {
            this.showStatus('Smart contract not connected.', 'error');
            return;
        }

        try {
            this.showStatus('Leveling up zombie...', 'success');

            await this.cryptoZombies.methods.levelUp(zombieId)
                .send({ 
                    from: this.userAccount, 
                    value: web3.utils.toWei("0.001", "ether") 
                });

            this.showStatus('Zombie leveled up successfully!', 'success');
            await this.loadUserZombies();
            
        } catch (error) {
            console.error('Level up error:', error);
            this.showStatus(`Error leveling up: ${error.message}`, 'error');
        }
    }

    /**
     * Feed on kitty
     */
    async feedOnKitty() {
        const zombieId = document.getElementById('zombieSelect').value;
        const kittyId = document.getElementById('kittyId').value;

        if (!zombieId || !kittyId) {
            this.showStatus('Please select a zombie and enter a kitty ID.', 'warning');
            return;
        }

        try {
            this.showLoading('feedKittyConfirmBtn', 'Feeding...');
            this.showStatus('Feeding on kitty...', 'success');

            await this.cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
                .send({ from: this.userAccount });

            this.showStatus('Successfully fed on kitty!', 'success');
            this.closeModal('feedKittyModal');
            document.getElementById('kittyId').value = '';
            
            await this.loadUserZombies();
            
        } catch (error) {
            console.error('Feed on kitty error:', error);
            this.showStatus(`Error feeding on kitty: ${error.message}`, 'error');
        } finally {
            this.hideLoading('feedKittyConfirmBtn', 'Feed on Kitty');
        }
    }

    /**
     * Attack another zombie
     */
    async attackZombie() {
        const attackerId = document.getElementById('attackerZombie').value;
        const targetId = document.getElementById('targetZombie').value;

        if (!attackerId || !targetId) {
            this.showStatus('Please select attacker and target.', 'warning');
            return;
        }

        try {
            this.showLoading('attackConfirmBtn', 'Attacking...');
            this.showStatus('Attacking zombie...', 'success');

            await this.cryptoZombies.methods.attack(attackerId, targetId)
                .send({ from: this.userAccount });

            this.showStatus('Attack completed!', 'success');
            this.closeModal('attackModal');
            document.getElementById('targetZombie').value = '';
            
            await this.loadUserZombies();
            
        } catch (error) {
            console.error('Attack error:', error);
            this.showStatus(`Error attacking: ${error.message}`, 'error');
        } finally {
            this.hideLoading('attackConfirmBtn', 'Attack!');
        }
    }

    /**
     * Transfer zombie
     */
    async transferZombie() {
        const zombieId = document.getElementById('transferZombie').value;
        const toAddress = document.getElementById('transferAddress').value;

        if (!zombieId || !toAddress) {
            this.showStatus('Please select zombie and enter recipient address.', 'warning');
            return;
        }

        if (!web3.utils.isAddress(toAddress)) {
            this.showStatus('Invalid recipient address.', 'warning');
            return;
        }

        try {
            this.showLoading('transferConfirmBtn', 'Transferring...');
            this.showStatus('Transferring zombie...', 'success');

            await this.cryptoZombies.methods.transferFrom(this.userAccount, toAddress, zombieId)
                .send({ from: this.userAccount });

            this.showStatus('Zombie transferred successfully!', 'success');
            this.closeModal('transferModal');
            document.getElementById('transferAddress').value = '';
            
            await this.loadUserZombies();
            
        } catch (error) {
            console.error('Transfer error:', error);
            this.showStatus(`Error transferring: ${error.message}`, 'error');
        } finally {
            this.hideLoading('transferConfirmBtn', 'Transfer');
        }
    }

    /**
     * Change zombie name
     */
    async changeZombieName() {
        const zombieId = document.getElementById('renameZombie').value;
        const newName = document.getElementById('newZombieName').value.trim();

        if (!zombieId || !newName) {
            this.showStatus('Please select zombie and enter new name.', 'warning');
            return;
        }

        try {
            this.showLoading('changeNameConfirmBtn', 'Renaming...');
            this.showStatus('Changing zombie name...', 'success');

            await this.cryptoZombies.methods.changeName(zombieId, newName)
                .send({ from: this.userAccount });

            this.showStatus('Zombie renamed successfully!', 'success');
            this.closeModal('changeNameModal');
            document.getElementById('newZombieName').value = '';
            
            await this.loadUserZombies();
            
        } catch (error) {
            console.error('Change name error:', error);
            this.showStatus(`Error changing name: ${error.message}`, 'error');
        } finally {
            this.hideLoading('changeNameConfirmBtn', 'Change Name');
        }
    }

    /**
     * Modal functions
     */
    showCreateZombieModal() {
        document.getElementById('createZombieModal').style.display = 'block';
        document.getElementById('zombieName').focus();
    }

    showFeedKittyModal() {
        document.getElementById('feedKittyModal').style.display = 'block';
    }

    showAttackModal() {
        document.getElementById('attackModal').style.display = 'block';
    }

    showTransferModal(zombieId = null) {
        const modal = document.getElementById('transferModal');
        const select = document.getElementById('transferZombie');
        
        if (zombieId) {
            select.value = zombieId;
        }
        
        modal.style.display = 'block';
    }

    showChangeNameModal(zombieId = null) {
        const modal = document.getElementById('changeNameModal');
        const select = document.getElementById('renameZombie');
        
        if (zombieId) {
            select.value = zombieId;
        }
        
        modal.style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Global functions for HTML onclick handlers
let app;

// Initialize app when page loads
window.addEventListener('load', () => {
    app = new CryptoZombiesApp();
});

// Global functions for backward compatibility
function connectWallet() {
    app.connectWallet();
}

function showCreateZombieModal() {
    app.showCreateZombieModal();
}

function createZombie() {
    app.createZombie();
}

function showFeedKittyModal() {
    app.showFeedKittyModal();
}

function feedOnKitty() {
    app.feedOnKitty();
}

function showAttackModal() {
    app.showAttackModal();
}

function attackZombie() {
    app.attackZombie();
}

function showMyZombies() {
    app.loadUserZombies();
}

function closeModal(modalId) {
    app.closeModal(modalId);
}
