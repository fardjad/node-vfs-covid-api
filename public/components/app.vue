<template>
  <section class="section">
    <div class="container">
      <h1 class="title">VFS Global Covid-19 Data</h1>
      <p class="content">
        This page allows you to query and filter VFS Global visa application center statuses.
        <br />It is part of an opensource project called
        <a
          href="https://github.com/fardjad/node-vfs-covid-api"
        >vfs-covid-api</a> hosted on GitHub.
        <br />Please note that the mentioned project and this page are in no way associated with the VFS Global website.
      </p>
      <hr />
      <query-form></query-form>
      <hr />
      <search-results></search-results>
    </div>
  </section>
</template>