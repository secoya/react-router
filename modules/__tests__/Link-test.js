import expect, { spyOn } from 'expect'
import React, { Component } from 'react'
import { Simulate, act } from 'react-dom/test-utils'
import { render } from 'react-dom'
import createHistory from '../createMemoryHistory'
import Router from '../Router'
import Route from '../Route'
import Link from '../Link'

const { click } = Simulate

describe('A <Link>', function () {

  class Hello extends Component {
    render() {
      return <div>Hello {this.props.params.name}!</div>
    }
  }

  class Goodbye extends Component {
    render() {
      return <div>Goodbye</div>
    }
  }

  let node
  beforeEach(function () {
    node = document.createElement('div')
  })

  it('should not render unnecessary class=""', function () {
    act(() => {
      render((
        <Link to="/something" />
      ), node)
    })
    const a = node.querySelector('a')
    expect(a.hasAttribute('class')).toBe(false)
  })

  it('knows how to make its href', function () {
    class LinkWrapper extends Component {
      render() {
        return (
          <Link to={{
            pathname: '/hello/michael',
            query: { the: 'query' },
            hash: '#the-hash'
          }}>
            Link
          </Link>
        )
      }
    }

    act(() => {
      render((
        <Router history={createHistory('/')}>
          <Route path="/" component={LinkWrapper} />
        </Router>
      ), node)
    })
    const a = node.querySelector('a')
    expect(a.getAttribute('href')).toEqual('/hello/michael?the=query#the-hash')
  })

  // This test needs to be in its own file with beforeEach(resetHash).
  //
  //it('knows how to make its href with HashHistory', function () {
  //  class LinkWrapper extends Component {
  //    render() {
  //      return <Link to="/hello/michael" query={{the: 'query'}}>Link</Link>
  //    }
  //  }

  //  render((
  //    <Router history={new HashHistory}>
  //      <Route path="/" component={LinkWrapper} />
  //    </Router>
  //  ), node, function () {
  //    const a = node.querySelector('a')
  //    expect(a.getAttribute('href')).toEqual('#/hello/michael?the=query')
  //  })
  //})

  describe('with params', function () {
    class App extends Component {
      render() {
        return (
          <div>
            <Link
              to="/hello/michael"
              activeClassName="active"
            >
              Michael
            </Link>
            <Link
              to={{ pathname: '/hello/ryan', query: { the: 'query' } }}
              activeClassName="active"
            >
              Ryan
            </Link>
          </div>
        )
      }
    }

    it('is active when its params match', function () {
      act(() => {
        render((
          <Router history={createHistory('/hello/michael')}>
            <Route path="/" component={App}>
              <Route path="hello/:name" component={Hello} />
            </Route>
          </Router>
        ), node)
      })
      const a = node.querySelectorAll('a')[0]
      expect(a.className.trim()).toEqual('active')
    })

    it('is not active when its params do not match', function () {
      act(() => {
        render((
          <Router history={createHistory('/hello/michael')}>
            <Route path="/" component={App}>
              <Route path="hello/:name" component={Hello} />
            </Route>
          </Router>
        ), node)
      })
      const a = node.querySelectorAll('a')[1]
      expect(a.className.trim()).toEqual('')
    })

    it('is active when its params and query match', function () {
      act(() => {
        render((
          <Router history={createHistory('/hello/ryan?the=query')}>
            <Route path="/" component={App}>
              <Route path="hello/:name" component={Hello} />
            </Route>
          </Router>
        ), node)
      })
      const a = node.querySelectorAll('a')[1]
      expect(a.className.trim()).toEqual('active')
    })

    it('is not active when its query does not match', function () {
      act(() => {
        render((
          <Router history={createHistory('/hello/ryan?the=other+query')}>
            <Route path="/" component={App}>
              <Route path="hello/:name" component={Hello} />
            </Route>
          </Router>
        ), node)
      })
      const a = node.querySelectorAll('a')[1]
      expect(a.className.trim()).toEqual('')
    })
  })

  describe('when its route is active and className is empty', function () {
    it("it shouldn't have an active class", function () {
      class LinkWrapper extends Component {
        render() {
          return (
            <div>
              <Link to="/hello" className="dontKillMe" activeClassName="">Link</Link>
              {this.props.children}
            </div>
          )
        }
      }

      const history = createHistory('/goodbye')

      act(() => {
        render(<Router history={history}>
          <Route path="/" component={LinkWrapper}>
            <Route path="goodbye" component={Goodbye} />
            <Route path="hello" component={Hello} />
          </Route>
        </Router>, node)
      })
      let a = node.querySelector('a')
      expect(a.className).toEqual('dontKillMe')
      act(() => { history.push('/hello') })

      expect(a.className).toEqual('dontKillMe')
    })
  })

  describe('when its route is active', function () {
    it('has its activeClassName', function () {
      class LinkWrapper extends Component {
        render() {
          return (
            <div>
              <Link to="/hello" className="dontKillMe" activeClassName="highlight">Link</Link>
              {this.props.children}
            </div>
          )
        }
      }

      const history = createHistory('/goodbye')

      act(() => {
        render((
          <Router history={history}>
            <Route path="/" component={LinkWrapper}>
              <Route path="goodbye" component={Goodbye} />
              <Route path="hello" component={Hello} />
            </Route>
          </Router>
        ), node)
      })

      let a = node.querySelector('a')
      expect(a.className).toEqual('dontKillMe')
      act(() => {
        history.push('/hello')
      })
      expect(a.className).toEqual('dontKillMe highlight')
    })

    it('has its activeStyle', function () {
      class LinkWrapper extends Component {
        render() {
          return (
            <div>
              <Link to="/hello" style={{ color: 'white' }} activeStyle={{ color: 'red' }}>Link</Link>
              {this.props.children}
            </div>
          )
        }
      }

      const history = createHistory('/goodbye')

      act(() => {
        render((
          <Router history={history}>
            <Route path="/" component={LinkWrapper}>
              <Route path="hello" component={Hello} />
              <Route path="goodbye" component={Goodbye} />
            </Route>
          </Router>
        ), node)
      })
      let a = node.querySelector('a')
      expect(a.style.color).toEqual('white')

      act(() => {
        history.push('/hello')
      })

      expect(a.style.color).toEqual('red')
    })
  })

  describe('when route changes', function () {
    it('changes active state', function () {
      class LinkWrapper extends Component {
        render() {
          return (
            <div>
              <Link to="/hello" activeClassName="active">Link</Link>
              {this.props.children}
            </div>
          )
        }
      }

      const history = createHistory('/goodbye')

      act(() => {
        render((
          <Router history={history}>
            <Route path="/" component={LinkWrapper}>
              <Route path="goodbye" component={Goodbye} />
              <Route path="hello" component={Hello} />
            </Route>
          </Router>
        ), node)
      })

      let a = node.querySelector('a')
      expect(a.className).toEqual('')

      act(() => {
        history.push('/hello')
      })

      expect(a.className).toEqual('active')
    })
  })

  describe('when clicked', function () {
    it('calls a user defined click handler', function () {
      class LinkWrapper extends Component {
        handleClick(event) {
          event.preventDefault()
        }
        render() {
          return <Link to="/hello" onClick={e => this.handleClick(e)}>Link</Link>
        }
      }

      act(() => {
        render((
          <Router history={createHistory('/')}>
            <Route path="/" component={LinkWrapper} />
            <Route path="/hello" component={Hello} />
          </Router>
        ), node)
      })

      click(node.querySelector('a'))
    })

    it('transitions to the correct route for string', function () {
      class LinkWrapper extends Component {
        render() {
          return (
            <Link to="/hello?the=query#hash">
              Link
            </Link>
          )
        }
      }

      const history = createHistory('/')
      const spy = spyOn(history, 'push').andCallThrough()
      const ref = React.createRef()

      act(() => {
        render((
          <Router ref={ref} history={history}>
            <Route path="/" component={LinkWrapper} />
            <Route path="/hello" component={Hello} />
          </Router>
        ), node)

        click(node.querySelector('a'), { button: 0 })
      })

      expect(node.innerHTML).toMatch(/Hello/)
      expect(spy).toHaveBeenCalled()

      const { location } = ref.current.state

      expect(location.pathname).toEqual('/hello')
      expect(location.search).toEqual('?the=query')
      expect(location.hash).toEqual('#hash')
    })

    it('transitions to the correct route for object', function () {
      class LinkWrapper extends Component {
        render() {
          return (
            <Link
              to={{
                pathname: '/hello',
                query: { how: 'are' },
                hash: '#world',
                state: { you: 'doing?' }
              }}
            >
              Link
            </Link>
          )
        }
      }

      const history = createHistory('/')
      const spy = spyOn(history, 'push').andCallThrough()
      const ref = React.createRef()

      act(() => {
        render((
          <Router history={history} ref={ref}>
            <Route path="/" component={LinkWrapper} />
            <Route path="/hello" component={Hello} />
          </Router>
        ), node)

        click(node.querySelector('a'), { button: 0 })
      })

      expect(node.innerHTML).toMatch(/Hello/)
      expect(spy).toHaveBeenCalled()

      const { location } = ref.current.state
      expect(location.pathname).toEqual('/hello')
      expect(location.search).toEqual('?how=are')
      expect(location.hash).toEqual('#world')
      expect(location.state).toEqual({ you: 'doing?' })
    })

    it('does not transition when onClick prevents default', function () {
      class LinkWrapper extends Component {
        render() {
          return <Link to="/hello" onClick={(e) => e.preventDefault()}>Link</Link>
        }
      }

      const history = createHistory('/')
      const spy = spyOn(history, 'push').andCallThrough()

      act(() => {
        render((
          <Router history={history}>
            <Route path="/" component={LinkWrapper} />
            <Route path="/hello" component={Hello} />
          </Router>
        ), node)

        click(node.querySelector('a'), { button: 0 })
      })

      expect(node.innerHTML).toMatch(/Link/)
      expect(spy).toNotHaveBeenCalled()
    })
  })

  describe('when the "to" prop is unspecified', function () {
    class App extends Component {
      render() {
        return (
          <div>
            <Link>Blank Link</Link>
            <Link />
            <Link className="kitten-link">Kittens</Link>
          </div>
        )
      }
    }

    it('returns an anchor tag without an href', function () {
      act(() => {
        render((
          <Router history={createHistory('/')}>
            <Route path="/" component={App} />
          </Router>
        ), node)
      })
      const link1 = node.querySelectorAll('a')[0]
      const link2 = node.querySelectorAll('a')[1]
      const link3 = node.querySelectorAll('a')[2]
      expect(link1.href).toEqual('')
      expect(link2.href).toEqual('')
      expect(link3.href).toEqual('')
    })

    it('passes down other props', function () {
      act(() => {
        render((
          <Router history={createHistory('/')}>
            <Route path="/" component={App} />
          </Router>
        ), node)
      })

      const link3 = node.querySelectorAll('a')[2]
      expect(link3.className).toEqual('kitten-link')
    })
  })
})
