/**
 * Zombie Visual Generator
 * Creates SVG-based zombie avatars from DNA strings
 */

class ZombieVisual {
    constructor() {
        this.colors = {
            skin: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F5DEB3'],
            hair: ['#8B4513', '#A0522D', '#654321', '#2F1B14', '#000000'],
            eyes: ['#228B22', '#32CD32', '#00FF00', '#ADFF2F', '#90EE90'],
            clothes: ['#800080', '#4B0082', '#8B008B', '#9932CC', '#9400D3'],
            blood: ['#8B0000', '#DC143C', '#FF0000', '#B22222', '#A52A2A']
        };
    }

    /**
     * Generate a zombie avatar from DNA
     * @param {string} dna - The DNA string
     * @param {number} size - Size of the SVG (default: 200)
     * @returns {string} SVG string
     */
    generateZombieSVG(dna, size = 200) {
        const dnaArray = this.parseDNA(dna);
        const features = this.extractFeatures(dnaArray);
        
        const svg = `
            <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Background -->
                <rect width="200" height="200" fill="url(#bgGradient)" rx="10"/>
                
                <!-- Zombie Body -->
                ${this.generateBody(features, size)}
                
                <!-- Zombie Head -->
                ${this.generateHead(features, size)}
                
                <!-- Zombie Eyes -->
                ${this.generateEyes(features, size)}
                
                <!-- Zombie Hair -->
                ${this.generateHair(features, size)}
                
                <!-- Zombie Mouth -->
                ${this.generateMouth(features, size)}
                
                <!-- Wounds/Blood -->
                ${this.generateWounds(features, size)}
                
                <!-- Clothing -->
                ${this.generateClothing(features, size)}
                
                <!-- Level Indicator -->
                ${this.generateLevelIndicator(features.level, size)}
            </svg>
        `;
        
        return svg;
    }

    /**
     * Parse DNA string into array of numbers
     * @param {string} dna - DNA string
     * @returns {Array} Array of DNA segments
     */
    parseDNA(dna) {
        const dnaStr = dna.toString().padStart(16, '0');
        const segments = [];
        for (let i = 0; i < dnaStr.length; i += 2) {
            segments.push(parseInt(dnaStr.substr(i, 2), 10));
        }
        return segments;
    }

    /**
     * Extract visual features from DNA array
     * @param {Array} dnaArray - Parsed DNA array
     * @returns {Object} Feature object
     */
    extractFeatures(dnaArray) {
        return {
            skinColor: this.colors.skin[dnaArray[0] % this.colors.skin.length],
            hairColor: this.colors.hair[dnaArray[1] % this.colors.hair.length],
            eyeColor: this.colors.eyes[dnaArray[2] % this.colors.eyes.length],
            clothesColor: this.colors.clothes[dnaArray[3] % this.colors.clothes.length],
            bloodColor: this.colors.blood[dnaArray[4] % this.colors.blood.length],
            headSize: 60 + (dnaArray[5] % 20),
            eyeSize: 8 + (dnaArray[6] % 8),
            mouthSize: 20 + (dnaArray[7] % 15),
            woundCount: dnaArray[0] % 5,
            level: Math.max(1, Math.floor(dnaArray[1] / 10) + 1)
        };
    }

    /**
     * Generate zombie body SVG
     * @param {Object} features - Extracted features
     * @param {number} size - SVG size
     * @returns {string} Body SVG
     */
    generateBody(features, size) {
        const bodyY = size * 0.6;
        const bodyWidth = size * 0.4;
        const bodyHeight = size * 0.35;
        
        return `
            <ellipse cx="${size/2}" cy="${bodyY}" rx="${bodyWidth/2}" ry="${bodyHeight/2}" 
                     fill="${features.skinColor}" opacity="0.8" filter="url(#glow)"/>
            <rect x="${size/2 - bodyWidth/4}" y="${bodyY - bodyHeight/4}" 
                  width="${bodyWidth/2}" height="${bodyHeight/2}" 
                  fill="${features.clothesColor}" opacity="0.7" rx="5"/>
        `;
    }

    /**
     * Generate zombie head SVG
     * @param {Object} features - Extracted features
     * @param {number} size - SVG size
     * @returns {string} Head SVG
     */
    generateHead(features, size) {
        const headX = size / 2;
        const headY = size * 0.3;
        const headSize = features.headSize;
        
        return `
            <circle cx="${headX}" cy="${headY}" r="${headSize}" 
                    fill="${features.skinColor}" opacity="0.9" filter="url(#glow)"/>
            <!-- Head scars -->
            ${this.generateScars(headX, headY, headSize, features)}
        `;
    }

    /**
     * Generate zombie eyes SVG
     * @param {Object} features - Extracted features
     * @param {number} size - SVG size
     * @returns {string} Eyes SVG
     */
    generateEyes(features, size) {
        const headY = size * 0.3;
        const eyeY = headY - 10;
        const eyeSpacing = features.headSize * 0.4;
        const eyeSize = features.eyeSize;
        
        return `
            <circle cx="${size/2 - eyeSpacing}" cy="${eyeY}" r="${eyeSize}" 
                    fill="${features.eyeColor}" filter="url(#glow)"/>
            <circle cx="${size/2 + eyeSpacing}" cy="${eyeY}" r="${eyeSize}" 
                    fill="${features.eyeColor}" filter="url(#glow)"/>
            <!-- Eye pupils -->
            <circle cx="${size/2 - eyeSpacing}" cy="${eyeY}" r="${eyeSize/3}" fill="#000000"/>
            <circle cx="${size/2 + eyeSpacing}" cy="${eyeY}" r="${eyeSize/3}" fill="#000000"/>
        `;
    }

    /**
     * Generate zombie hair SVG
     * @param {Object} features - Extracted features
     * @param {number} size - SVG size
     * @returns {string} Hair SVG
     */
    generateHair(features, size) {
        const headY = size * 0.3;
        const headSize = features.headSize;
        const hairY = headY - headSize * 0.7;
        
        return `
            <path d="M ${size/2 - headSize*0.8} ${hairY} 
                     Q ${size/2 - headSize*0.4} ${hairY - 20} ${size/2} ${hairY - 15}
                     Q ${size/2 + headSize*0.4} ${hairY - 20} ${size/2 + headSize*0.8} ${hairY}
                     Z" 
                  fill="${features.hairColor}" opacity="0.8"/>
        `;
    }

    /**
     * Generate zombie mouth SVG
     * @param {Object} features - Extracted features
     * @param {number} size - SVG size
     * @returns {string} Mouth SVG
     */
    generateMouth(features, size) {
        const headY = size * 0.3;
        const mouthY = headY + 15;
        const mouthSize = features.mouthSize;
        
        return `
            <ellipse cx="${size/2}" cy="${mouthY}" rx="${mouthSize/2}" ry="${mouthSize/4}" 
                     fill="#000000" opacity="0.8"/>
            <!-- Teeth -->
            <rect x="${size/2 - mouthSize/4}" y="${mouthY - mouthSize/8}" 
                  width="${mouthSize/6}" height="${mouthSize/4}" fill="#FFFFFF"/>
            <rect x="${size/2 + mouthSize/12}" y="${mouthY - mouthSize/8}" 
                  width="${mouthSize/6}" height="${mouthSize/4}" fill="#FFFFFF"/>
        `;
    }

    /**
     * Generate zombie wounds SVG
     * @param {Object} features - Extracted features
     * @param {number} size - SVG size
     * @returns {string} Wounds SVG
     */
    generateWounds(features, size) {
        let wounds = '';
        const woundCount = features.woundCount;
        
        for (let i = 0; i < woundCount; i++) {
            const x = size * 0.2 + (size * 0.6 * Math.random());
            const y = size * 0.2 + (size * 0.6 * Math.random());
            const woundSize = 3 + Math.random() * 5;
            
            wounds += `
                <circle cx="${x}" cy="${y}" r="${woundSize}" 
                        fill="${features.bloodColor}" opacity="0.7"/>
            `;
        }
        
        return wounds;
    }

    /**
     * Generate zombie clothing SVG
     * @param {Object} features - Extracted features
     * @param {number} size - SVG size
     * @returns {string} Clothing SVG
     */
    generateClothing(features, size) {
        const bodyY = size * 0.6;
        const clothesY = bodyY - size * 0.1;
        
        return `
            <rect x="${size/2 - size*0.15}" y="${clothesY}" 
                  width="${size*0.3}" height="${size*0.2}" 
                  fill="${features.clothesColor}" opacity="0.8" rx="5"/>
            <!-- Tattered edges -->
            <path d="M ${size/2 - size*0.15} ${clothesY} 
                     L ${size/2 - size*0.18} ${clothesY + 5}
                     L ${size/2 - size*0.12} ${clothesY + 8}
                     L ${size/2 - size*0.15} ${clothesY + 10}
                     Z" fill="${features.clothesColor}" opacity="0.6"/>
        `;
    }

    /**
     * Generate level indicator SVG
     * @param {number} level - Zombie level
     * @param {number} size - SVG size
     * @returns {string} Level indicator SVG
     */
    generateLevelIndicator(level, size) {
        const indicatorSize = 30;
        const x = size - indicatorSize - 10;
        const y = 10;
        
        return `
            <circle cx="${x}" cy="${y}" r="${indicatorSize/2}" 
                    fill="#892cdc" opacity="0.9" stroke="#16c172" stroke-width="2"/>
            <text x="${x}" y="${y + 5}" text-anchor="middle" 
                  fill="#ffffff" font-family="Roboto" font-weight="bold" font-size="12">
                ${level}
            </text>
        `;
    }

    /**
     * Generate scars on zombie head
     * @param {number} headX - Head center X
     * @param {number} headY - Head center Y
     * @param {number} headSize - Head radius
     * @param {Object} features - Extracted features
     * @returns {string} Scars SVG
     */
    generateScars(headX, headY, headSize, features) {
        let scars = '';
        const scarCount = 2 + (features.woundCount % 3);
        
        for (let i = 0; i < scarCount; i++) {
            const angle = (i * Math.PI * 2) / scarCount;
            const x = headX + Math.cos(angle) * headSize * 0.7;
            const y = headY + Math.sin(angle) * headSize * 0.7;
            const scarLength = 8 + Math.random() * 12;
            
            scars += `
                <line x1="${x - scarLength/2}" y1="${y}" 
                      x2="${x + scarLength/2}" y2="${y}" 
                      stroke="${features.bloodColor}" stroke-width="2" opacity="0.8"/>
            `;
        }
        
        return scars;
    }

    /**
     * Generate a simple zombie emoji based on DNA
     * @param {string} dna - DNA string
     * @returns {string} Zombie emoji/character
     */
    generateZombieEmoji(dna) {
        const dnaArray = this.parseDNA(dna);
        const features = this.extractFeatures(dnaArray);
        
        // Simple emoji-based representation
        const baseEmoji = '🧟';
        const levelEmoji = features.level > 5 ? '👑' : features.level > 3 ? '⚡' : '';
        
        return `${baseEmoji}${levelEmoji}`;
    }

    /**
     * Get zombie rarity based on DNA
     * @param {string} dna - DNA string
     * @returns {Object} Rarity information
     */
    getZombieRarity(dna) {
        const dnaArray = this.parseDNA(dna);
        const uniqueValues = new Set(dnaArray).size;
        
        let rarity = 'Common';
        let color = '#7a7a8c';
        
        if (uniqueValues >= 12) {
            rarity = 'Legendary';
            color = '#ffd700';
        } else if (uniqueValues >= 10) {
            rarity = 'Epic';
            color = '#892cdc';
        } else if (uniqueValues >= 8) {
            rarity = 'Rare';
            color = '#16c172';
        } else if (uniqueValues >= 6) {
            rarity = 'Uncommon';
            color = '#ed8936';
        }
        
        return { rarity, color, uniqueValues };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZombieVisual;
} else {
    window.ZombieVisual = ZombieVisual;
}
