import React from 'react'
import { Snackbar } from '@material-ui/core';

export default function SnackBarContent(props) {

  // Snackbar that allows you to set the content, visibility 
  // and change visibility from parent component
  const { content, visible, setVisible } = props;

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
