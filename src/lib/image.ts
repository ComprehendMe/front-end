/** Converte PNG/JPEG para WebP antes do upload para o bucket. */
export function fileToWebpBlob(file: File, quality = 0.9): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();

		img.onload = () => {
			const max = 512;
			let { width, height } = img;
			if (width > max || height > max) {
				const ratio = Math.min(max / width, max / height);
				width = Math.round(width * ratio);
				height = Math.round(height * ratio);
			}

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(new Error('Canvas not supported'));
				return;
			}
			ctx.drawImage(img, 0, 0, width, height);
			canvas.toBlob(
				(blob) => {
					URL.revokeObjectURL(url);
					if (blob) resolve(blob);
					else reject(new Error('Failed to convert image'));
				},
				'image/webp',
				quality,
			);
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Failed to load image'));
		};

		img.src = url;
	});
}
