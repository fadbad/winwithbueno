const sum = (...summands) =>
  summands.map(parseFloat).reduce((a, b) => a + b, 0)

const isIE = typeof document !== 'undefined' ? !!document.documentElement['currentStyle'] : false

export const pick = (obj, keys) => keys.reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
}, {})

const clean = (props) => {
    const { children, $$scope, $$slots, ...rest } = props
    return rest
}

const HIDDEN_TEXTAREA_STYLE = {
    'min-height': '0',
    'max-height': 'none',
    // height: "0",
    visibility: 'hidden',
    overflow: 'hidden',
    position: 'absolute',
    'z-index': '-1000',
    top: '0',
    right: '0',
}
  
function forceHiddenStyles(node) {
    return Object.entries(HIDDEN_TEXTAREA_STYLE).forEach(([key, value]) =>
      node.style.setProperty(key, value, 'important'),
    )
}

const SIZING_STYLE = [
    'borderBottomWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopWidth',
    'boxSizing',
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    // non-standard
    'tabSize',
    'textIndent',
    // non-standard
    'textRendering',
    'textTransform',
    'width',
]
  
function getSizingData(node) {
    const style = window.getComputedStyle(node)
  
    if (style === null) {
      return null
    }
  
    let sizingStyle = pick(style, SIZING_STYLE)
    const { boxSizing } = sizingStyle
  
    // probably node is detached from DOM, can't read computed dimensions
    if (boxSizing === '') {
      return null
    }
  
    // IE (Edge has already correct behaviour) returns content width as computed width
    // so we need to add manually padding and border widths
    if (isIE && boxSizing === 'border-box') {
      sizingStyle.width =
        sum(
          sizingStyle.width,
          sizingStyle.borderRightWidth,
          sizingStyle.borderLeftWidth,
          sizingStyle.paddingRight,
          sizingStyle.paddingLeft,
        ) + 'px'
    }
  
    const paddingSize = sum(sizingStyle.paddingBottom, sizingStyle.paddingTop)
  
    const borderSize = sum(
      sizingStyle.borderBottomWidth,
      sizingStyle.borderTopWidth,
    )
  
    return {
      sizingStyle,
      paddingSize,
      borderSize,
    }
}


let hiddenTextarea

const getHeight = (node, sizingData) => {
    const height = node.scrollHeight
    if (sizingData.sizingStyle.boxSizing === 'border-box') {
        // border-box: add border, since height = content + padding + border
        return height + sizingData.borderSize
    }

    // remove padding, since height = content
    return height - sizingData.paddingSize
}

function calculateNodeHeight(sizingData, value) {
    if (!hiddenTextarea) {
        hiddenTextarea = document.createElement('textarea')
        hiddenTextarea.setAttribute('tab-index', '-1')
        hiddenTextarea.setAttribute('aria-hidden', 'true')
        hiddenTextarea.setAttribute('rows', '1')
        forceHiddenStyles(hiddenTextarea)
    }

    if (hiddenTextarea.parentNode === null) {
        document.body.appendChild(hiddenTextarea)
    }

    const { paddingSize, borderSize, sizingStyle } = sizingData
    const { boxSizing } = sizingStyle

    Object.entries(sizingStyle).forEach(
        ([key, value]) => (hiddenTextarea.style[key] = value),
    )

    forceHiddenStyles(hiddenTextarea)

    hiddenTextarea.value = value
    let height = getHeight(hiddenTextarea, sizingData)

    // measure height of a textarea with a single row
    hiddenTextarea.value = 'x'
    const rowHeight = hiddenTextarea.scrollHeight - paddingSize

    let minHeight = rowHeight
    if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize
    }
    return Math.max(minHeight, height)
}

export default function autoresize(node) {
    const resize = () => {
        const nodeSizingData = getSizingData(node)
  
        if (!nodeSizingData) {
            return
        }
  
        const height = calculateNodeHeight(
            nodeSizingData,
            node.value || node.placeholder || 'x',
        )
        node.style.setProperty('height', `${height}px`, 'important')
    }
    node.addEventListener('input', resize)
    window.addEventListener('resize', resize)
    resize()
}
