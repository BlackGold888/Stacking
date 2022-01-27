// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./IERC20.sol";

contract Staking{
    IERC20 public rewardsToken;
    IERC20 public stakingToken;

    uint public globalRewardTime;
    uint public globalRewardPrecent;
    address public owner;

    mapping(address => uint) public rewards;
    mapping(address => uint) public lastUpdateTimes;

    uint public _totalSupply;
    mapping(address => uint) private _balances;

    constructor(address _stakingToken, address _rewardsToken, uint _rewardTime, uint _globalRewardPrecent) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
        globalRewardTime = _rewardTime;
        globalRewardPrecent = _globalRewardPrecent;
        owner = msg.sender;
    }

    modifier updateReward(address account) {
        _calcReward(account);
        _;
    } 

    function stake(uint _amount) external updateReward(msg.sender) {
        _totalSupply += _amount; 
        _balances[msg.sender] += _amount;
        lastUpdateTimes[msg.sender] = block.timestamp;

        stakingToken.transferFrom(msg.sender, address(this), _amount);
    }

    function unstake(uint _amount) external updateReward(msg.sender) {
        _totalSupply -= _amount;
        _balances[msg.sender] -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }

    function claim() external updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        rewardsToken.transfer(msg.sender, reward);
    }

    function _calcReward(address account) internal {
        uint reward = ((block.timestamp - lastUpdateTimes[account]) / globalRewardTime)
         * ((_balances[account] * globalRewardPrecent) / 10000);
         if(reward != 0){
             rewards[account] += reward;
             lastUpdateTimes[account] += ((block.timestamp - lastUpdateTimes[account]) / globalRewardTime) * globalRewardTime;
         }
    }

    function getRewards(address _user) external updateReward(_user) returns(uint){
        return rewards[_user];
    }

    function totalSupply() external view returns(uint){
        return _totalSupply;
    }
}
