// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {HaxhirNFT} from "../src/HaxhirNFT.sol";

contract HaxhirNFTTest is Test {
    HaxhirNFT public nft;
    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    string public constant SAMPLE_URI = "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

    function setUp() public {
        nft = new HaxhirNFT();
    }

    // 1. Collection Identity Test
    function test_CollectionNameAndSymbol() public view {
        assertEq(nft.name(), "Haxhir Collectibles");
        assertEq(nft.symbol(), "HXNFT");
    }

    // 2. Minting and Ownership Test
    function test_MintNFT() public {
        uint256 tokenId = nft.mintNFT(user1, SAMPLE_URI);

        assertEq(tokenId, 0);
        assertEq(nft.ownerOf(0), user1);
        assertEq(nft.balanceOf(user1), 1);
        assertEq(nft.tokenURI(0), SAMPLE_URI);
        assertEq(nft.totalMinted(), 1);
    }

    // 3. Security: Non-Owner cannot mint
    function test_NonOwnerCannotMint() public {
        vm.prank(user1);
        vm.expectRevert();
        nft.mintNFT(user1, SAMPLE_URI);
    }

    // 4. NFT Transfer Test
    function test_TransferNFT() public {
        nft.mintNFT(user1, SAMPLE_URI);

        // user1 transfers Token #0 to user2
        vm.prank(user1);
        nft.safeTransferFrom(user1, user2, 0);

        assertEq(nft.ownerOf(0), user2);
        assertEq(nft.balanceOf(user1), 0);
        assertEq(nft.balanceOf(user2), 1);
    }
}