<template>
  <div>
      <div class="cardTitle"><span>{{title}}</span> <svg t="1657594107027" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3828" width="16" height="16"><path d="M512.001 928.997c230.524 0 418.076-187.552 418.075-418.077 0-230.527-187.552-418.077-418.075-418.077s-418.077 187.55-418.077 418.077c0 230.525 187.552 418.077 418.077 418.077zM512 301.88c28.86 0 52.26 23.399 52.26 52.263 0 28.858-23.399 52.257-52.26 52.257s-52.26-23.399-52.26-52.257c0-28.863 23.399-52.263 52.26-52.263zM459.74 510.922c0-28.86 23.399-52.26 52.26-52.26s52.26 23.399 52.26 52.26l0 156.775c0 28.86-23.399 52.26-52.26 52.26s-52.26-23.399-52.26-52.26l0-156.775z" p-id="3829" fill="#8a8a8a"></path></svg></div>
      <div class="cardNumber">{{count}}</div>
      <div class="cardCharts">
          <slot name="charts"></slot>
      </div>
      <div class="cardTotal">
          <slot name='footer'></slot>
      </div>
  </div>
</template>

<script>
export default {
    name:'Detail',
    props:['title','count']
}
</script>

<style>
.cardTitle {
    display: flex;
    justify-content: space-between;
    color:#8d8c92
}
.cardNumber {
    margin-top: 5px;
    font-size: 30px;
}
.cardCharts {
    height: 60px;
    font-size: 14px;
}
svg {
    margin-bottom: -4px;
}
.cardTotal {
    border-top: 1px solid #eee;
    padding-top: 10px;
}
</style>