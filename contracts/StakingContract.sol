// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./IERC20.sol";

contract Staking{
    IERC20 public rewardsToken;
    IERC20 public stakingToken;

    uint public globalRewardTime;
    uint public globalRewardPrecent;
    uint public globalfreezeTime;
    address public owner;

    mapping(address => uint) public rewards;
    mapping(address => uint) public lastUpdateTimes;
    mapping(address => uint) public freezeUpdateTimes;

    uint public _totalSupply;
    mapping(address => uint) private _balances;

    constructor(address _stakingToken, address _rewardsToken, uint _rewardTime, uint _globalRewardPrecent, uint _globalfreezeTime) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
        globalRewardTime = _rewardTime;
        globalRewardPrecent = _globalRewardPrecent;
        owner = msg.sender;
        globalfreezeTime = _globalfreezeTime;
    }

    modifier updateReward(address account) {
        _calcReward(account);
        _;
    }

    modifier checkFreezeTime() {
        uint withdrawTime = block.timestamp - freezeUpdateTimes[msg.sender];
        require(withdrawTime >= globalfreezeTime, "Withdraw available after 10 min");
        _;
    } 

    modifier onlyStakingOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function stake(uint _amount) external updateReward(msg.sender) {
        _totalSupply += _amount; 
        _balances[msg.sender] += _amount;
        lastUpdateTimes[msg.sender] = block.timestamp;
        freezeUpdateTimes[msg.sender] = block.timestamp;

        stakingToken.transferFrom(msg.sender, address(this), _amount);
    }

    function unstake(uint _amount) external updateReward(msg.sender) checkFreezeTime{
        _totalSupply -= _amount;
        _balances[msg.sender] -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }

    function claim() external updateReward(msg.sender) checkFreezeTime{
        uint reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        rewardsToken.transfer(msg.sender, reward);
    }

    function _calcReward(address account) internal {
        uint precent = uint(_balances[account] * globalRewardPrecent / 100);
        uint timeLeft = block.timestamp - lastUpdateTimes[account];
        uint reward = uint(timeLeft / globalRewardTime) * precent; 

         if(reward != 0){
             rewards[account] += reward;
             lastUpdateTimes[account] = block.timestamp;
         }
    }

    function getRewards(address _user) public view returns(uint256){
        return rewards[_user];
    }

    function totalSupply() external view returns(uint){
        return _totalSupply;
    }

    function setGlobalRewardTime(uint time) external onlyStakingOwner{
        globalRewardTime = time;
    }

    function setGlobalRewardPrecent(uint time) external onlyStakingOwner{
        globalRewardPrecent = time;
    }

    function setGlobalfreezeTime(uint time) external onlyStakingOwner{
        globalfreezeTime = time;
    }

    function getDelay() external returns(uint){
        return block.timestamp;
    }   
}
