import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './node-content-renderer.scss';

function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  );
}

// eslint-disable-next-line react/prefer-stateless-function
class MinimalThemeNodeContentRenderer extends Component {
  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      node,
      level,
      title,
      borderColor,
      details,
      subtitle,
      draggedNode,
      path,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
      icons,
      buttons,
      className,
      style,
      didDrop,
      swapFrom,
      swapLength,
      swapDepth,
      treeId, // Not needed, but preserved for other renderers
      isOver, // Not needed, but preserved for other renderers
      parentNode, // Needed for dndManager
      rowDirection,
      ...otherProps
    } = this.props;
    const nodeTitle = title || node.title;
    const nodeSubtitle = subtitle || node.subtitle;
    const nodeDetails = details || node.details;
    const nodeBorderColor = borderColor || node.borderColor;
    const nodeLevel = level || node.level;

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;
    const nodeContent = connectDragPreview(<div
      className={
        styles.rowContents +
        (isSearchMatch ? ` ${styles.rowSearchMatch}` : '') +
        (isSearchFocus ? ` ${styles.rowSearchFocus}` : '') +
        (!canDrag ? ` ${styles.rowContentsDragDisabled}` : '') +
        (nodeLevel ? ` level-${nodeLevel}` : '')
      }
      style={{
        borderLeftColor: nodeBorderColor,
      }}
    >
      <div className={styles.rowLabel}>
        <span
          className={
            `${styles.rowTitle} ${node.subtitle ? ` ${styles.rowTitleWithSubtitle}` : ''}`
          }
        >
          {typeof nodeTitle === 'function'
            ? nodeTitle({
              node,
              path,
              treeIndex,
            })
            : nodeTitle}
        </span>

        {nodeSubtitle && (
          <span className={styles.rowSubtitle}>
            {typeof nodeSubtitle === 'function'
              ? nodeSubtitle({
                node,
                path,
                treeIndex,
              })
              : nodeSubtitle}
          </span>
        )}
        {nodeDetails && (
          <span className={styles.rowDetails}>
            {typeof nodeDetails === 'function'
              ? nodeDetails({
                node,
                path,
                treeIndex,
              })
              : nodeDetails}
          </span>
        )}
      </div>

      <div className={styles.rowToolbar}>
        {buttons.map((btn, index) => (
          <div
            key={index} // eslint-disable-line react/no-array-index-key
            className={`sortable-row-button ${styles.toolbarButton}`}
          >
            {btn}
          </div>
        ))}
      </div>
    </div>
    );

    return (
      <div style={{ height: '100%' }} {...otherProps}>
        {toggleChildrenVisibility &&
          node.children &&
          (node.children.length > 0 || typeof node.children === 'function') && (
            <div>
              <button
                type="button"
                aria-label={node.expanded ? 'Collapse' : 'Expand'}
                className={
                  node.expanded ? styles.collapseButton : styles.expandButton
                }
                onClick={() =>
                  toggleChildrenVisibility({
                    node,
                    path,
                    treeIndex,
                  })
                }
              />

              {node.expanded &&
                !isDragging && (
                  <div
                    style={{ width: scaffoldBlockPxWidth }}
                    className={styles.lineChildren}
                  />
                )}
            </div>
          )}

        <div
          className={
            styles.rowWrapper +
            (!canDrag ? ` ${styles.rowWrapperDragDisabled}` : '')
          }
        >
          <div
            className={`${styles.row
              }${isLandingPadActive ? ` ${styles.rowLandingPad}` : ''
              }${isLandingPadActive && !canDrop ? ` ${styles.rowCancelPad}` : ''
              }${className ? ` ${className}` : ''}`
            }
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1,
              paddingLeft: scaffoldBlockPxWidth,
              // width: scaffoldBlockPxWidth,
              ...style,
            }}
          >
            {canDrag
              ? connectDragSource(nodeContent, { dropEffect: 'copy' })
              : nodeContent}
          </div>
        </div>
      </div>
    );
  }
}

MinimalThemeNodeContentRenderer.defaultProps = {
  buttons: [],
  canDrag: false,
  canDrop: false,
  className: '',
  level: null,
  borderColor: null,
  details: null,
  draggedNode: null,
  icons: [],
  isSearchFocus: false,
  isSearchMatch: false,
  parentNode: null,
  style: {},
  subtitle: null,
  swapDepth: null,
  swapFrom: null,
  swapLength: null,
  title: null,
  toggleChildrenVisibility: null,
  rowDirection: 'ltr'
};

const nodeShape = {
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  details: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};
nodeShape.children = PropTypes.arrayOf(PropTypes.shape(nodeShape));

const Node = PropTypes.shape(nodeShape);

MinimalThemeNodeContentRenderer.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  canDrag: PropTypes.bool,
  className: PropTypes.string,
  level: PropTypes.number,
  borderColor: PropTypes.string,
  details: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  icons: PropTypes.arrayOf(PropTypes.node),
  isSearchFocus: PropTypes.bool,
  isSearchMatch: PropTypes.bool,
  node: Node.isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  subtitle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  swapDepth: PropTypes.number,
  swapFrom: PropTypes.number,
  swapLength: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  toggleChildrenVisibility: PropTypes.func,
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,

  // Drag and drop API functions
  // Drag source
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  didDrop: PropTypes.bool.isRequired,
  draggedNode: PropTypes.shape({}),
  isDragging: PropTypes.bool.isRequired,
  parentNode: PropTypes.shape({}), // Needed for dndManager
  // Drop target
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool.isRequired,
  rowDirection: PropTypes.string
};

export default MinimalThemeNodeContentRenderer;
