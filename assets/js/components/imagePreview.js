export function initImagePreview({
  fileInputId = 'fileInput',
  previewId = 'uploadPreview',
  imageId = 'previewImage'
} = {}) {
  const fileInput = document.getElementById(fileInputId);
  const preview = document.getElementById(previewId);
  const previewImage = document.getElementById(imageId);

  if (!fileInput || !preview || !previewImage) {
    return {
      clear() {}
    };
  }

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
        previewImage.src = loadEvent.target.result;
        preview.style.display = 'block';
      };

      reader.readAsDataURL(file);
    }
  });

  return {
    clear() {
      preview.style.display = 'none';
      previewImage.removeAttribute('src');
      fileInput.value = '';
    }
  };
}
