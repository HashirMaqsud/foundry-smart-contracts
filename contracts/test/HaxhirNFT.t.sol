// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {HaxhirNFT} from "../src/HaxhirNFT.sol";

contract HaxhirNFTTest is Test {
    HaxhirNFT public nft;
    address public owner;
    address public user;

    function setUp() public {
        owner = address(this);
        user = makeAddr("user");
        nft = new HaxhirNFT();
    }

    // 1. Standard Unit Test: Initial Mint Count
    function test_InitialTotalMintedIsZero() public view {
        assertEq(nft.totalMinted(), 0);
    }

    // 2. Fuzz Test: Minting with randomized URIs and Recipients
    function testFuzz_MintNFT(address recipient, string memory metadataURI) public {
        // Discard zero address as ERC-721 reverts on minting to 0x0
        vm.assume(recipient != address(0));

        // Exclude precompiles / VM internal addresses to ensure clean safeMint
        vm.assume(recipient.code.length == 0);

        uint256 initialTotal = nft.totalMinted();
        uint256 tokenId = nft.mintNFT(recipient, metadataURI);

        assertEq(tokenId, initialTotal + 1);
        assertEq(nft.totalMinted(), initialTotal + 1);
        assertEq(nft.ownerOf(tokenId), recipient);
        assertEq(nft.tokenURI(tokenId), metadataURI);
    }
}