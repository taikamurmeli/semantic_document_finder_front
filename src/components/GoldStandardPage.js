import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Typography, Button } from '@material-ui/core'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'

import '../App.css'
import QueryResult from './QueryResult'
import SimilarityRatingInfo from './SimilarityRatingInfo'
import DocumentList from './DocumentList'
import { getGoldStandardDocuments } from '../actions/documentActions'
import { getUserRatings } from '../actions/userActions'
import DelayedCircularProgress from './material-ui-render-components/DelayedCircularProgress'

function mapStateToProps (state) {
  return {
    ratingDocuments: state.document.ratingDocuments,
    loggedUser: state.user.loggedUser,
    similarityRatings: state.user.similarityRatings,
    getLoggedUserInProgress: state.user.getLoggedUserInProgress,
    getRatingDocumentsInProgress: state.document.getRatingDocumentsInProgress
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getUserRatings: () => getUserRatings(dispatch),
    getGoldStandardDocuments: () => getGoldStandardDocuments(dispatch)
  }
}

class GoldStandardPage extends Component {

  state = {
    showGoldStandard: true
  }

  toggleShowGoldStandard = () => {
    this.setState({
      showGoldStandard: !this.state.showGoldStandard
    })
  }

  componentDidMount () {
    this.props.getUserRatings().then(this.props.getGoldStandardDocuments())
  }

  renderGoldStandard () {
    return (<Paper style={{margin: '20px', maxHeight: 'none'}}>
        <div style={{display: 'flex'}}>
          <Typography variant="title" style={{textAlign: 'center', padding: '20px', flexGrow: '1'}}>
            <Translate value="page.goldStandard.documents"/>
          </Typography>
          <Button onClick={this.toggleShowGoldStandard}>
            {this.state.showGoldStandard ?
              <Translate value="hide"/>
              :
              <Translate value="show"/>
            }
          </Button>
        </div>
        {this.state.showGoldStandard &&
        <DocumentList documents={this.props.ratingDocuments}/>}
      </Paper>
    )
  }

  render () {
    return (
      <div className="flex">
        <div className="page-title">
          <Typography variant="title"><Translate value="page.goldStandard.title"/></Typography>
          <SimilarityRatingInfo/>
        </div>
        {this.props.getRatingDocumentsInProgress ? <DelayedCircularProgress/> : this.renderGoldStandard()}
        <QueryResult/>
      </div>
    )
  }
}

GoldStandardPage.propTypes = {
  loggedUser: PropTypes.string,
  ratingDocuments: PropTypes.array,
  similarityRatings: PropTypes.array,
  getLoggedUserInProgress: PropTypes.bool,
  getUserRatings: PropTypes.func.isRequired,
  getGoldStandardDocuments: PropTypes.func.isRequired,
  getRatingDocumentsInProgress: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(GoldStandardPage)
