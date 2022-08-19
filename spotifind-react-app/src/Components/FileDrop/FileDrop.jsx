import React, { useEffect } from 'react';
import {
  Download,
  Upload
} from '@mui/icons-material';
import './FileDrop.scss';

/**
 * @param {File} selectedFile
 *    => Currently selected file
 * @param {Function} setSelectedFile
 *    => Sets the currently selected file
 * @param {String} id
 *    => Used to provide the drag and drop functionality
 * @param {Function} validateFile
 *    => Checks if passed file is valid
 * @param {String} error
 *    => Error that is a result of an invalid file
 * @param {Function} setError
 *    => Sets the external error value
 */
const FileDrop = ({
  selectedFile, setSelectedFile, id, validateFile, error, setError, width, padding
}) => {
  const setFile = (file) => {
    setSelectedFile(file);
    setError(false);
  };

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    console.log(file.name, file.type)
    if (validateFile(file)) setFile(file);
    else setError(true);
  }

  const handleSelection = (e) => {
    const { files } = e.target;
    const file = files[0];
    if (validateFile(file)) setFile(file);
    else setError(true);
  };

  useEffect(() => {
    const form = document.getElementById('box');
    const preventEvents = 'drag dragstart dragend dragover dragenter dragleave drop'.split(' ');
    const highlightEvents = 'dragover dragenter'.split(' ');

    preventEvents.forEach((event) => {
      form.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      document.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    highlightEvents.forEach((event) => {
      form.addEventListener(event, () => form.classList.add('is-dragover'));
      document.addEventListener(event, () => form.classList.remove('is-dragover'));
    });

    form.addEventListener('drop', (e) => {
      form.classList.remove('is-dragover');
      handleDrop(e);
    });
  }, []);

  return (
    <div className="file-drop">
      <form 
      className="box has-advanced-upload" 
      id="box" 
      style={{ 
        width: (width ? width : '90%'),
        padding: (padding ? padding : 'padding: 60px 20px')
      }}>

        { !selectedFile && <Download fontSize='large' />}
        { selectedFile && <Upload fontSize='large' />}

        <div className="box-input">
          <input
            className="box-file" type="file" id={id}
            multiple onChange={handleSelection}
          />
          <label htmlFor={id} style={{ display: 'flex' }}>
            <p className="box-dragndrop"><b>Choose { selectedFile ? 'a different' : 'a'} file</b> or drag it here.</p>
          </label>
        </div>
        { !error && selectedFile && <div className="box-uploading">{ selectedFile.name }</div>}
        { error && <div className="box-error">Invalid File!<span /></div>}
      </form>

    </div>
  );
};

export default FileDrop;
