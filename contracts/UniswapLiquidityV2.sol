// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract Swap {
    IUniswapV2Router02 router;
    IUniswapV2Factory factory;

    constructor(address _routerAddress, address _factoryAddress){
        router = IUniswapV2Router02(_routerAddress);
        factory = IUniswapV2Factory(_factoryAddress);
    }

        function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint _amountA,
        uint _amountB
    ) external {
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        IERC20(_tokenA).approve(address(router), _amountA);
        IERC20(_tokenB).approve(address(router), _amountB);

        (uint amountA, uint amountB, uint liquidity) = router
        .addLiquidity(
            _tokenA,
            _tokenB,
            _amountA,
            _amountB,
            1,
            1,
            address(this),
            block.timestamp
        );
    }

    function removeLiquidity(address _tokenA, address _tokenB) external {
        address pair = factory.getPair(_tokenA, _tokenB);

        uint liquidity = IERC20(pair).balanceOf(address(this));
        IERC20(pair).approve(address(router), liquidity);

        (uint amountA, uint amountB) = router.removeLiquidity(
            _tokenA,
            _tokenB,
            liquidity,
            1,
            1,
            address(this),
            block.timestamp
        );
    }
}
