// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract HaxhirNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // NFT Collection Name: "Haxhir Collectibles", Symbol: "HXNFT"
    constructor() ERC721("Haxhir Collectibles", "HXNFT") Ownable(msg.sender) {}

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }

    function totalMinted() public view returns (uint256) {
        return _nextTokenId;
    }
}