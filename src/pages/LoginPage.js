import React from 'react'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'

import LoginForm from '../forms/LoginForm'
import { Translate } from 'react-redux-i18n'
import '../App.css'
import DelayedCircularProgress from '../components/material-ui-render-components/DelayedCircularProgress'
import SigninDialog from '../components/dialogs/SigninDialog'

function mapStateToProps (state) {
  return {
    loggedUser: state.user.loggedUser,
    loginInProgress: state.user.loginInProgress
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

class LoginPage extends React.Component {

  render () {
    return (
      this.props.loggedUser ?
        <Redirect to={process.env.PUBLIC_URL + "/compare-documents"}/>
        :
          <div className="flex flex-column" style={{flexWrap: 'nowrap'}}>
            <Typography variant="h5" className="page-title">
              <Translate value="page.login.title"/>
            </Typography>
            <Typography className="page-title" style={{whiteSpace: 'pre-line'}}>
              <Translate value="page.login.info"/>
            </Typography>
            <div style={{width: '100%'}}>
                {this.props.loginInProgress ? <DelayedCircularProgress/> : <LoginForm/>}
            </div>
            <div style={{display: 'flex', padding: '1vw'}}>
              <Typography variant="h6" className="page-title">
                <Translate value="page.login.signin"/>
              </Typography>
              <SigninDialog/>
            </div>
          </div>
    )
  }
}

LoginPage.propTypes = {
  loggedUser: PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)