// SPDX-License-Identifier: UNLICENSED
//not using currently for development purpose
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


pragma solidity ^0.8.10;
contract DocumentMARKETPLACE is ReentrancyGuard {
    address payable immutable contractOwner;
    uint256 public listingPrice = 0.015 ether;
    uint public imagesCount = 0;
    uint256 public constant platformFeePercent = 10;

    constructor() {
    contractOwner = payable(msg.sender);
}

    struct Documents {
        string title;
        string description;
        string email;
        string category;
        uint256 price;
        address owner;
        string image;
        string pdf;
        uint256 timestamp;
        uint256 id;
    }
    mapping(uint256 => Documents) private documentsList;

    event documentUploaded(string indexed text, uint256 indexed id);
    event documentsPurchased(uint256 indexed id, address buyer, uint price);

    function uploadIPFS(
        address _owner,
        string memory _image,
        string memory _pdf,
        string memory _title,
        string memory _description,
        string memory _email,
        string memory _category,
        uint _price
    ) external payable {
        require(msg.value >= listingPrice, "Insufficient payment");
        require(_price > 0);

        imagesCount++;

        documentsList[imagesCount] = Documents({
            title: _title,
            description: _description,
            email: _email,
            category: _category,
            price: _price,
            owner: _owner,
            image: _image,
            pdf: _pdf,
            timestamp: block.timestamp,
            id: imagesCount
        });

        emit documentUploaded("Document uploaded successfully", imagesCount);
    }
    function getAllNFTs() public view returns (Documents[] memory) {
        uint itemCount = imagesCount;
        uint256 currentIndex = 0;
        Documents[] memory items = new Documents[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            Documents storage currentItem = documentsList[i + 1];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }
    function getImage(
        uint256 id
    )
        external
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            address,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        Documents memory items = documentsList[id];
        return (
            items.title,
            items.description,
            items.email,
            items.category,
            items.price,
            items.owner,
            items.image,
            items.pdf,
            items.timestamp,
            items.id
        );
    }
    function updateListingPrice(uint256 _price) external {
        require(msg.sender == contractOwner, "only owner can call");
        listingPrice = _price;
    }

    function updateBuyingPrice(uint256 _price, uint id) external {
        require(_price > 0, "price should be grater then 0");
        Documents storage items = documentsList[id];
        require(
            msg.sender == items.owner,
            "Only the document owner can update price"
        );
        items.price = _price;
    }

    function purchaseDocument(uint _id) public payable {
        Documents storage documents = documentsList[_id];

        require(
            msg.value >= documents.price,
            "item price is less or incorrects"
        );
        require(documents.owner != address(0), "Document does not exist");
        require(documents.owner != msg.sender, "cannot buy your own document");

        uint fee = (msg.value * platformFeePercent) / 1000;
        uint256 ownerShare = msg.value - fee;


        address payable previousOwner = payable(documents.owner);
        documents.owner = msg.sender;

        (bool feeSuccess, ) = contractOwner.call{value: fee}("");
        (bool success, ) = previousOwner.call{value: ownerShare}("");
        require(success && feeSuccess, "transaction Failed");
        emit documentsPurchased(_id, msg.sender, msg.value);
    }
    // add nonRetrant
    function withdrawFund() external {
        require(msg.sender == contractOwner,"you are not the owner");
        (bool success,) = payable(contractOwner).call{value:address(this).balance}("");
        require(success,"transaction failed");
    }
    function deleteDocument( uint _id) external  {
        Documents storage items =  documentsList[_id];
        require(items.owner == msg.sender,"you cannot delete others document");
        require(items.owner != address(0), "Document does not exist");
        (bool success,) = payable(items.owner).call{value:items.price}("");
        require(success);
        delete  documentsList[_id];


    }

}
