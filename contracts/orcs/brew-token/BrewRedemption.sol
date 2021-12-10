// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./IBrew.sol";
import "../IOrcs.sol";

contract BrewRedemption is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 public periodEnd;
    uint256 public periodNumber;
    uint256 public redemptionAmount;
    IBrew public brew;
    IOrcs public orc;

    mapping(uint256 => mapping(uint256 => bool)) public hasOrcRedeemedInPeriod;

    event RedeemedBrew(
        address indexed user,
        uint256 orcId,
        uint256 periodEnd,
        uint256 redemptionAmount
    );

    constructor(IBrew _brew, IOrcs _orc) {
        redemptionAmount = 10;
        periodEnd = block.timestamp.add(1 days);

        brew = _brew;
        orc = _orc;
    }

    function redeem(uint256 orcId) external nonReentrant {
        updatePeriodIfNecessary();
        require(
            orc.ownerOf(orcId) == _msgSender(),
            "cannot redeem brew from an orc that is not yours"
        );
        require(
            !hasOrcRedeemedInPeriod[orcId][periodNumber],
            "already redeemed brew reward for this orc in current period"
        );

        hasOrcRedeemedInPeriod[orcId][periodNumber] = true;
        brew.mint(_msgSender(), redemptionAmount);

        emit RedeemedBrew(_msgSender(), orcId, periodNumber, redemptionAmount);
    }

    function updatePeriodIfNecessary() private {
        if (block.timestamp > periodEnd) {
            periodEnd = periodEnd.add(1 days);
            periodNumber = periodNumber.add(1);
            updatePeriodIfNecessary(); // recursively update if necessary
        }
    }

    // owner mode
    function updateRedemptionAmount(uint256 newRedemptionAmount)
        external
        onlyOwner
    {
        redemptionAmount = newRedemptionAmount;
    }
}
