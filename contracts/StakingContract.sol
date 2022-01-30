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

    struct UserInfo {
        uint lastUpdateTimes;
        uint freezeUpdateTimes;
        uint balance;
        uint rewards;
    }

    mapping(address => UserInfo) private users;
    uint public _totalStaks;

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
        uint withdrawTime = block.timestamp - users[msg.sender].freezeUpdateTimes;
        require(withdrawTime >= globalfreezeTime, "Withdraw available after 10 min");
        _;
    } 

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function stake(uint _amount) external updateReward(msg.sender) {
        require(_amount > 0, "Amount should be bigger 0");
        users[msg.sender] = UserInfo(block.timestamp, block.timestamp, _amount, 0);

        _totalStaks += _amount; 
        stakingToken.transferFrom(msg.sender, address(this), _amount);
    }

    function unstake(uint _amount) external updateReward(msg.sender) checkFreezeTime{
        require(_amount > 0, "Amount should be bigger 0");
        require(users[msg.sender].balance >= _amount, "Your balance less than amount");
        users[msg.sender].balance -= _amount;
        _totalStaks -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }

    function claim() external updateReward(msg.sender) checkFreezeTime{
        require(users[msg.sender].rewards > 0, "Amount should be bigger 0");
        rewardsToken.transfer(msg.sender, users[msg.sender].rewards);
        users[msg.sender].rewards = 0;
    }

    function _calcReward(address _account) internal {
        uint precent = (users[_account].balance * globalRewardPrecent / 100);
        uint timeLeft = block.timestamp - users[_account].lastUpdateTimes;
        uint reward = (timeLeft / globalRewardTime) * precent; 

         if(reward != 0){
             users[_account].rewards += reward;
             users[_account].lastUpdateTimes = block.timestamp;
         }
    }

    function getRewards(address _user) public view returns(uint){
        return users[_user].rewards;
    }

    function totalStaks() external view returns(uint){
        return _totalStaks;
    }

    function setGlobalRewardTime(uint time) external onlyOwner{
        globalRewardTime = time;
    }

    function setGlobalRewardPrecent(uint time) external onlyOwner{
        globalRewardPrecent = time;
    }

    function setGlobalfreezeTime(uint time) external onlyOwner{
        globalfreezeTime = time;
    } 
}
