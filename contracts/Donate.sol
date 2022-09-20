// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';

contract Donate is Ownable {
    /// Receipt addresses
    address[] private _receipts;
    /// Donation amount options
    uint256[] private _donationAmounts;
    /// Mapping from receipt address to exists flag
    mapping(address => bool) public isRegisteredReceipt;
    /// Mapping from donation amount to exists flag
    mapping(uint256 => bool) public isRegisteredAmount;

    /// @dev Emitted when a `donor` donates `amount` of ETH to `receipt`
    /// @param donor address of donor
    /// @param receipt address of receipt
    /// @param amount donation amount
    event Donation(address indexed donor, address indexed receipt, uint256 amount);

    /// @dev Emitted when the owner add `newReceipt` to `_receipts`
    /// @param newReceipt address of the new receipt
    event ReceiptAdded(address indexed newReceipt);

    /// @dev Emitted when the owner add `newDonationAmount` to `_donationAmounts`
    /// @param newDonationAmount donation amount
    event DonationAmountAdded(uint256 newDonationAmount);

    constructor(address _receipt, uint256 _donationAmount) {
        _receipts.push(_receipt);
        isRegisteredReceipt[_receipt] = true;
        _donationAmounts.push(_donationAmount);
        isRegisteredAmount[_donationAmount] = true;
    }

    /// @dev Donate ETH to receipt
    /// Requirements
    ///   - `msg.value` must be same as donation amount
    /// Emits a {Donation} event
    function donate(uint256 receiptOption, uint256 donateOption) external payable {
        require(receiptOption < _receipts.length, 'Donate: invalid receipt option');
        require(donateOption < _donationAmounts.length, 'Donate: invalid donate option');
        address donor = _msgSender();
        address receipt = payable(_receipts[receiptOption]);
        require(msg.value == _donationAmounts[donateOption], 'Donate: invalid donation amount');

        (bool sent, ) = receipt.call{value: msg.value}('');
        require(sent, 'Donate: failed to donate');

        emit Donation(donor, receipt, msg.value);
    }

    /// @dev Add a new receipt address
    /// @param newReceipt new receipt address
    /// Requirements
    ///   - `newReceipt` must be valid
    ///   - `newReceipt` must not be registered
    /// Emits a {ReceiptUpdated} event
    function addReceipt(address newReceipt) external onlyOwner {
        require(newReceipt != address(0), 'Donate: invalid receipt address');
        require(isRegisteredReceipt[newReceipt] == false, 'Donate: address is already registered');

        _receipts.push(newReceipt);
        isRegisteredReceipt[newReceipt] = true;

        emit ReceiptAdded(newReceipt);
    }

    /// @dev Add a new donation amount option
    /// @param newDonationAmount new donation amount
    /// Requirements
    ///   - `newDonationAmount` must be positive number
    ///   - `newDonationAmount` must not be registered
    /// Emits a {DonationAmountUpdated} event
    function addDonationAmount(uint256 newDonationAmount) external onlyOwner {
        require(newDonationAmount != 0, 'Donate: amount must not be zero');
        require(isRegisteredAmount[newDonationAmount] == false, 'Donate: amount is already registered');

        _donationAmounts.push(newDonationAmount);
        isRegisteredAmount[newDonationAmount] = true;

        emit DonationAmountAdded(newDonationAmount);
    }

    /// @notice Get all receipt addresses
    /// @dev Returns `_receipts`
    /// @return _receipts registered receipt addresses
    function getReceiptAddresses() external view returns (address[] memory) {
        return _receipts;
    }

    /// @notice Get all donation amounts
    /// @dev Returns `_donationAmounts`
    /// @return _donationAmounts registered donation amounts
    function getDonationAmounts() external view returns (uint256[] memory) {
        return _donationAmounts;
    }
}
