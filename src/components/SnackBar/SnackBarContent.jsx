import React from 'react'
import { Snackbar } from '@material-ui/core';

// Snackbar that allows you to set the content, visibility 
// and change visibility from parent component
export default function SnackBarContent(props) {

  const { content, visible, setVisible } = props;

  // When opened, closes itself after 2.5sec
  const handleSnackBarOpen = () => {
    setTimeout(() => {
      setVisible(false);
    }, 2500)
  }

  return (
    <Snackbar
      open={visible}
      message={content}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      onEntered={() => handleSnackBarOpen()}
    />
  )
}
