import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Web3 from 'web3';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';
import {
  Typography,
  CircularProgress,
  Grid
} from '@material-ui/core';
// Contracts
import EthSwap from '../abis/EthSwap.json';
import Token from '../abis/Token.json';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    textAlign: 'center'
  },
  loader: {
    margin: 'auto',
    padding: 'auto',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const App = ({
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState('');
  const [ethBalance, setEthBalance] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [token, setToken] = useState({});
  const [ethSwap, setEthSwap] = useState({});

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    // ETH Balance
    const ethBalance = await web3.eth.getBalance(accounts[0]);
    setEthBalance(ethBalance);

    // Token Balance
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      setToken(token);
      let tokenBalance = await token.methods.balanceOf(accounts[0]).call();
      setTokenBalance(tokenBalance.toString());
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    // Load Swap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      setEthSwap(ethSwap);
    } else {
      window.alert('EthSwap contract not deployed to detected network.')
    }
  }

  const buyTokens = async (etherAmount) => {
    setLoading(true);
    ethSwap.methods.buyTokens()
      .send({ value: etherAmount, from: account })
      .on('transactionHash', (hash) => {
        setLoading(false);
      });
  }

  const sellTokens = async (tokenAmount) => {
    setLoading(true);
    token.methods.approve(ethSwap.address, tokenAmount)
      .send({ from: account })
      .on('transactionHash', (hash) => {
        ethSwap.methods.sellTokens(tokenAmount)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            setLoading(false);
          });
      });

  }

  useEffect(() => {
    async function connection() {
      setLoading(true);
      await loadWeb3();
      await loadBlockchainData();
      setLoading(false);
    }
    connection();
  }, []);

  return (
    <div>
      <Navbar
        account={account}
      />
      <main
        className={classes.content}
      >
        {loading ?
          <>
            <Grid container spacing={3}>
              <div className={classes.drawerHeader} />
              <Grid item xs={12} className={classes.loaderContainer}>
                <CircularProgress className={classes.loader} />
              </Grid>
            </Grid>
          </>
          :
          <>
            <div className={classes.drawerHeader} />
            <Main
              ethBalance={ethBalance}
              tokenBalance={tokenBalance}
              buyTokens={buyTokens}
              sellTokens={sellTokens}
            />
            {/* <Typography>{`TriBIM blockchain:`}</Typography>
            <Typography>{`Account:`}<strong>{`${account}`}</strong></Typography>
            <Typography>{`ETH Balance: ${ethBalance}`}</Typography>
            <Typography>{`Token Balance: ${tokenBalance}`}</Typography> */}
          </>
        }
      </main>
    </div>
  );
}

export default App;
