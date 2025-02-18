// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Settlement {
    struct Trade {
        uint256 tradeId;
        string assetType;
        uint256 quantity;
        address counterparty;
        bool settled;
    }

    mapping(uint256 => Trade) public trades;

    event TradeSettled(uint256 tradeId, address counterparty, uint256 quantity, string assetType);

    function initiateTrade(uint256 tradeId, string memory assetType, uint256 quantity, address counterparty) public {
        require(trades[tradeId].tradeId == 0, "Trade already exists");
        trades[tradeId] = Trade(tradeId, assetType, quantity, counterparty, false);
    }

    function settleTrade(uint256 tradeId) public {
        require(trades[tradeId].tradeId != 0, "Trade does not exist");
        require(trades[tradeId].settled == false, "Trade already settled");

        trades[tradeId].settled = true;
        emit TradeSettled(tradeId, trades[tradeId].counterparty, trades[tradeId].quantity, trades[tradeId].assetType);
    }

    function getTradeStatus(uint256 tradeId) public view returns (bool) {
        return trades[tradeId].settled;
    }
}
