pragma solidity ^0.4.25;

contract MockKittyCore {
    // Mock implementation of KittyCore for testing purposes
    
    function getKitty(uint256 _id) external view returns (
        bool isGestating,
        bool isReady,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes
    ) {
        // Return mock data - generate some pseudo-random DNA based on the ID
        uint256 mockDna = uint256(keccak256(abi.encodePacked(_id, block.timestamp))) % 1000000000000000000;
        
        return (
            false,      // isGestating
            true,       // isReady
            0,          // cooldownIndex
            0,          // nextActionAt
            0,          // siringWithId
            now,        // birthTime
            0,          // matronId
            0,          // sireId
            1,          // generation
            mockDna     // genes (this is what we care about)
        );
    }
}
