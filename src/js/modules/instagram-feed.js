import Slider from '../components/slider';

const instagramFeed = () => {
  const feed = document.querySelector('.instagram-feed');
  if (!feed) return;

  const apiUrl = 'https://graph.facebook.com/v23.0/17841404205017264/media?fields=id,caption,media_type,media_url,timestamp,permalink&limit=20&access_token=EAASkR6f6ZCSwBRDN7J1vlp4H3SclJlChyRI7OnEtuPZBjnjjUayZADRISUwiB87hLlBaZAAuQYNokYhIcwbqMYg0FW2GGZCdvdHU5Qb03HsHff125RK8XyLKWMugasyTgP8JbuLbrzZBQy41yHpOuH3tNSv6AfyVJHOWy6YTBkuK6ubF40lDwXjZAA6K70bipCNixsrG8XzaFtJI1gVcF1S2OPc';

  const escapeHtml = (value) => {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const createMediaHtml = (item) => {
    const mediaUrl = item.media_url || '';
    const permalink = item.permalink || '#';
    const caption = escapeHtml(item.caption || '');
    const timestamp = formatDate(item.timestamp);
    const isVideo = item.media_type === 'VIDEO';

    if (!mediaUrl) return '';

    return `
      <div class="instagram-feed__item swiper-slide">
        <a class="instagram-feed__link" href="${permalink}" target="_blank" rel="noopener noreferrer">
          <div class="instagram-feed__media">
            ${isVideo
              ? `<video class="instagram-feed__video" src="${mediaUrl}" muted playsinline loop autoplay></video>`
              : `<img class="instagram-feed__image" src="${mediaUrl}" alt="">`
            }
          </div>
          ${caption ? `<p class="instagram-feed__caption">${caption}</p>` : ''}
          ${timestamp ? `<time class="instagram-feed__date" datetime="${item.timestamp}">${timestamp}</time>` : ''}
        </a>
      </div>
    `;
  };

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Instagram API request failed: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const items = Array.isArray(data.data) ? data.data : [];
      if (!items.length) return;

      feed.innerHTML = items.map(createMediaHtml).join('');
      new Slider('.instagram-feed__slider');
    })
    .catch((error) => {
      console.error(error);
    });
}

export default instagramFeed;
