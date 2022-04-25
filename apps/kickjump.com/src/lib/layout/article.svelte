<script>
  export let title;
  export let author;
  export let date;
</script>

<h1>{title}</h1>
<p class="article-date">on: {date}</p>
<p class="article-author">by: {author}</p>

<slot>
  <!-- the mdsvex content will be slotted in here -->
</slot>
