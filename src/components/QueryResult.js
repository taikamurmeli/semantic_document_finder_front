import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Paper } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import DelayedCircularProgress from './material-ui-render-components/DelayedCircularProgress'
import Divider from '@material-ui/core/Divider'
import * as R from 'ramda'

import '../App.css'
import DocumentList from './DocumentList'
import { findDOMNode } from 'react-dom'
import { Translate } from 'react-redux-i18n'
import QueryResultOptionDialog from './dialogs/QueryResultOptionDialog'

function mapStateToProps (state) {
  return {
    queryDocument: state.document.queryDocument,
    getSimilarDocumentsInProgress: state.document.getSimilarDocumentsInProgress,
    similarDocuments: state.document.similarDocuments,
    queryFilters: state.query.filters
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

class QueryResult extends Component {
  componentDidUpdate () {
    const listNode = findDOMNode(this.refs.listContainer)
    listNode && listNode.scrollIntoView()
  }

  state = {
    showQueryDocument: false
  }

  toggleShowQueryDocument = () => {
    this.setState({
      showQueryDocument: !this.state.showQueryDocument
    })
  }

  renderQueryDocument = (queryDocument) => {
    return (
      <Paper style={{margin: '20px'}}>
        <Button style={{float: 'right'}} onClick={this.toggleShowQueryDocument} autoFocus>
          <Translate value="hide"/>
        </Button>
        {queryDocument.xml ?
          <div style={{padding: '10px'}} dangerouslySetInnerHTML={{__html: queryDocument.xml}}/>
          :
          <div><Typography variant='title'>{queryDocument.title}</Typography>
            <Typography style={{padding: '10px', whiteSpace: 'pre-wrap'}}>{queryDocument.content}</Typography>
          </div>
        }
      </Paper>
    )
  }

  filterDocumentList = (documents) => {
    const court = this.props.queryFilters.court
    const maxLength = this.props.queryFilters.maxLength
    const contains = this.props.queryFilters.contains
    let filteredDocuments = court? R.filter(x => x.court === court, documents) : documents
    filteredDocuments = maxLength? R.filter(x => x.word_count <= maxLength, filteredDocuments) : filteredDocuments
    filteredDocuments = contains? R.filter(x => {
        const doctext = R.replace(/<[^>]*>/g, ' ', x.xml)
        const filterPhrases = contains.split(',').map(x => x.trim())
        return R.all(filterPhrase => doctext.includes(filterPhrase))(filterPhrases)
    }, filteredDocuments): filteredDocuments

    return filteredDocuments
  }


  renderResult = () => {
    return (
      <Paper style={{padding: '0.5vw', margin: '1vw', maxHeight: 'none'}}>
        <div style={{display: 'flex'}}>
          <Typography variant='h5' style={{padding: '20px', flexGrow: 1}}>
            <Translate value="document.mostSimilar"/>
          </Typography>
          <QueryResultOptionDialog/>
        </div>
        <Divider/>
        <div ref='listContainer' className="result-list-container container-100">
          <div style={{minWidth: '5%', maxWidth: '100%', display: 'flex'}}>
          {this.state.showQueryDocument ?
            this.renderQueryDocument(this.props.queryDocument)
            :
            <Button style={{fontSize: '10', marginTop: '20px', marginBottom: '20px', flexGrow: 1}}
                    onClick={this.toggleShowQueryDocument}>
              <Translate value="document.showQuery"/>
            </Button>}
          </div>
          <div className="result-list" style={{flex: '1 1 auto', maxWidth: '100%', minWidth: '70%'} }>
            <DocumentList documents={this.filterDocumentList(this.props.similarDocuments)}/>
          </div>
        </div>
      </Paper>
    )
  }

  render () {
    return this.props.getSimilarDocumentsInProgress ?
      <DelayedCircularProgress/>
      :
      this.props.similarDocuments.length === 0 ?
        <div/>
        : this.renderResult()
  }
}

QueryResult.propTypes = {
  queryDocument: PropTypes.object.isRequired,
  queryFilters: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryResult)