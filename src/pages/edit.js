import React from "react"

const loadStoryblokBridge = () =>
  new Promise(resolve => {
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = `//app.storyblok.com/f/storyblok-latest.js?t=${"buqBGFY6ppCYJHi3CWnzSQtt"}`
    script.onload = resolve
    document.getElementsByTagName("head")[0].appendChild(script)
  })

const getParam = function(val) {
  let result = ""
  let tmp = []

  window.location.search
    .substr(1)
    .split("&")
    .forEach(item => {
      tmp = item.split("=")
      if (tmp[0] === val) {
        result = decodeURIComponent(tmp[1])
      }
    })

  return result
}

class StoryblokEntry extends React.Component {
  constructor(props) {
    super(props)
    this.state = { story: null }
  }

  componentDidMount() {
    loadStoryblokBridge().then(() => this.initStoryblokEvents())
  }

  loadStory(payload) {
    window.storyblok.get(
      {
        slug: getParam("path"),
        version: "draft",
      },
      ({ story }) => {
        this.setState({ story })
      }
    )
  }

  initStoryblokEvents() {
    this.loadStory({
      storyId: getParam("path"),
    })

    const sb = window.storyblok

    sb.on(["change", "published"], payload => {
      this.loadStory(payload)
    })

    /*sb.on("input", payload => {
      console.log(payload)
      // if (this.state.story && payload.story.id === this.state.story.id) {
      payload.story.content = sb.addComments(
        payload.story.content,
        payload.story.id
      )
      this.setState(prevstate => ({
        story: { ...payload.story },
      }))
      // }
    })*/

    sb.pingEditor(() => {
      if (sb.inEditor) {
        sb.enterEditmode()
      }
    })
  }

  render() {
    if (this.state.story == null) {
      return <div />
    }
    const { content } = this.state.story

    return <div>{content.test}</div>
  }
}

export default StoryblokEntry
