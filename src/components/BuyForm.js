import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Identicon from 'identicon.js';
import {
  AppBar,
  Toolbar,
  Typography,
  Input,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  TextField,
  FormControl,
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  IconButton,
  MenuItem
} from '@material-ui/core';
import EthSvg from './ethereum.svg';
import TokenSvg from './token.svg';
import CachedIcon from '@material-ui/icons/Cached';

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  input: {
    backgroundColor: 'white'
  },
  img: {
    width: '3em',
    height: 'auto',
  }
}));

const BuyForm = ({
  ethBalance,
  tokenBalance,
  values,
  handleChange,
  handleSwitchForm,
  buyTokens
}) => {
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6} style={{ textAlign: 'left' }}>
          <Typography noWrap>
            <strong>Input</strong>
          </Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography noWrap>
            {`Balance: ${ethBalance ? window.web3.utils.fromWei(ethBalance, 'Ether') : 0}`}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'left' }}>
          <FormControl className={classes.margin} style={{ width: "100%" }}>
            <OutlinedInput
              id="outlined-basic"
              variant="outlined"
              className={classes.input}
              value={values.input}
              onChange={handleChange('input')}
              endAdornment={
                <InputAdornment position="start">
                  <img src={EthSvg} className={classes.img} />
                  {`ETH`}
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <IconButton
            onClick={() => handleSwitchForm()}
          >
            <CachedIcon fontSize="large" color="primary" />
          </IconButton>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'left' }}>
          <Typography noWrap>
            <strong>Output</strong>
          </Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography noWrap>
            {`Balance: ${tokenBalance ? window.web3.utils.fromWei(tokenBalance, 'Ether') : 0}`}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'left' }}>
          <FormControl className={classes.margin} style={{ width: "100%" }}>
            <OutlinedInput
              disabled
              id="outlined-basic"
              variant="outlined"
              className={classes.input}
              value={values.output}
              onChange={handleChange('output')}
              endAdornment={
                <InputAdornment position="start">
                  <img src={TokenSvg} className={classes.img} />
                  {`TBIM`}
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'left' }}>
          <Typography noWrap>
            Exchange Rate
        </Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography noWrap>
            {`1 ETH: 100 TBIM`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "100%" }}
            onClick={() => {
              let etherAmount = values.input;
              etherAmount = window.web3.utils.toWei(etherAmount, 'Ether');
              buyTokens(etherAmount);
            }}
          >
            Swap
        </Button>
        </Grid>
      </Grid>
    </>
  )
};

export default BuyForm;
