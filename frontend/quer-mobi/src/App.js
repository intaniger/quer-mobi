import React from 'react'
import { Router, Route, cleanPath } from 'react-static'
import { easeQuadOut } from 'd3-ease'
import { NodeGroup } from 'react-move'
import { withContext, getContext } from 'recompose'
import PropTypes from 'prop-types'
//
import Routes from 'react-static-routes'
import 'semantic-ui-css/semantic.min.css';
import './app.css'

// The magic :)
const AnimatedRoutes = getContext({
  // We have to preserve the router context for each route
  // otherwise, a component may rerender with the wrong data
  // during animation
  router: PropTypes.object,
  // We'll also look for the staticURL, so we can disable the animation during static render
  staticURL: PropTypes.string,
})(({ getComponentForPath, router, staticURL }) => (
  <Route
    path="*"
    render={props => {
      // Get the component for this path
      let Comp = getComponentForPath(cleanPath(props.location.pathname))
      if (!Comp) {
        Comp = getComponentForPath('404')
      }

      // When we're rendering for static HTML, be sure to NOT animate in.
      if (staticURL) {
        return (
          // This relative wrapper is necessary for accurate rehydration :)
          <div style={{ position: 'relative' }}>
            <Comp {...props} />
          </div>
        )
      }
      const PreservedRouterContext = withContext(
        {
          router: PropTypes.object,
        },
        () => ({
          router,
        })
      )(props => <div {...props} />)
      // Use React-Move to animate the different components coming in and out
      return (
        <NodeGroup
          // React-move will handle the entry and exit of any items we pass in `data`
          data={[
            {
              // pass the current Comp, props, ID and router
              id: props.location.pathname,
              Comp,
              props,
              router,
            },
          ]}
          keyAccessor={d => d.id}
          start={() => ({
            opacity: [0],
            scale: 1,
            translateX: [20],
          })}
          enter={() => ({
            opacity: [1],
            translateX: [0],
            timing: { duration: 500, delay: 200, ease: easeQuadOut },
          })}
          update={() => ({
            opacity: [1],
          })}
          // leave={() => ({
          //   opacity: [0],
          //   translateX: [-20],
          //   timing: { duration: 500, ease: easeQuadOut },
          // })}
        >
          {/* {nodes => {console.log(nodes.length);return(
            <div style={{ position: 'relative' }}>
              {nodes.map(({ key, data, state: { opacity, translateX } }) => {
                // Here, we override the router context with the one that was
                // passed with each route
                const PreservedRouterContext = withContext(
                  {
                    router: PropTypes.object,
                  },
                  () => ({
                    router: data.router,
                  })
                )(props => <div {...props} />)

                return (
                  <PreservedRouterContext
                    key={key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      transform: `translateX(${translateX}px)`,
                      opacity,
                    }}
                  >
                    <data.Comp {...data.props} />
                  </PreservedRouterContext>
                )
              })}
            </div>
          )}} */}
          {nodes => (
            <div style={{ position: 'relative' }}>
              {
                nodes.length > 0?
                <PreservedRouterContext
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    transform: `translateX(${nodes[0].state.translateX}px)`,
                    opacity: nodes[0].state.opacity,
                  }}
                >
                  <Comp {...props} />
                </PreservedRouterContext>:null
              }
            </div>
          )}
        </NodeGroup>
      )
    }}
  />
))

const App = () => (
  <Router>
    <div>
      <div className="content">
        <Routes component={AnimatedRoutes} />
      </div>
    </div>
  </Router>
)

export default App
