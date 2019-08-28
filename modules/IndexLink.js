import createClass from 'create-react-class'
import Link from './Link'
import React from 'react'

/**
 * An <IndexLink> is used to link to an <IndexRoute>.
 */
const IndexLink = createClass({

  render() {
    return <Link {...this.props} onlyActiveOnIndex={true} />
  }

})

export default IndexLink
