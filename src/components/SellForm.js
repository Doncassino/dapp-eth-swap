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
  MenuItem
} from '@material-ui/core';
import EthSvg from './ethereum.svg';
import TokenSvg from './token.svg';

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
  img: {
    width: '3em',
    height: 'auto',
  }
}));

const sellForm = ({
  ethBalance,
  tokenBalance,
  values,
  handleChange,
  sellTokens
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
            {`Balance: ${tokenBalance ? window.web3.utils.fromWei(tokenBalance.toString(), 'Ether') : 0}`}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'left' }}>
          <FormControl className={classes.margin} style={{ width: "100%" }}>
            <OutlinedInput
              id="outlined-basic"
              variant="outlined"
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
            <strong>Output</strong>
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
              disabled
              id="outlined-basic"
              variant="outlined"
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
              let etherAmount = values.input.toString();
              etherAmount = window.web3.utils.toWei(etherAmount, 'Ether');
              sellTokens(etherAmount);
            }}
          >
            Swap
        </Button>
        </Grid>
      </Grid>
    </>
  )
};

export default sellForm;
