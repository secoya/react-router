import expect from 'expect'
import React, { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import createHistory from '../createMemoryHistory'
import { act } from 'react-dom/test-utils'
import resetHash from './resetHash'
import Router from '../Router'
import Route from '../Route'

describe('pushState', function () {

  class Index extends Component {
    render() {
      return <h1>Index</h1>
    }
  }

  class Home extends Component {
    render() {
      return <h1>Home</h1>
    }
  }

  beforeEach(resetHash)

  let node
  beforeEach(function () {
    node = document.createElement('div')
  })

  afterEach(function () {
    unmountComponentAtNode(node)
  })

  describe('when the target path contains a colon', function () {
    it('works', function () {
      const history = createHistory('/')
      const ref = React.createRef()

      act(() => {
        render((
          <Router history={history} ref={ref}>
            <Route path="/" component={Index} />
            <Route path="/home/hi:there" component={Home} />
          </Router>
        ), node)
      })
      expect(ref.current.state.location.pathname).toEqual('/')

      act(() => {
        history.push('/home/hi:there')
      })

      expect(ref.current.state.location.pathname).toEqual('/home/hi:there')
    })
  })

})
