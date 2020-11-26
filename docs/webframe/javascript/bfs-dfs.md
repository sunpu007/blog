```html
<!DOCTYPE html>
<html lang="en">
<head></head>
<body>
  <div id="parent">
    <div class="children1">
      <div class="children1-1">
        <div class="children1-1-1">a</div>
        <div class="children1-1-2">b</div>
        <div class="children1-1-3">c</div>
      </div>
      <div class="children1-2">
        <div class="children1-2-1">d</div>
      </div>
      <div class="children1-3">
        <div class="children1-3-1">e</div>
        <div class="children1-3-2">f</div>
      </div>
    </div>
    <div class="children2">
      <div class="children2-1">
        <div class="children2-1-1"></div>
      </div>
    </div>
    <div class="children3">
      <div class="children3-1"></div>
    </div>
  </div>
  <script>
    const node_parent = document.querySelector('#parent');
    // DFS深度优先遍历  -> 栈
    const dfs = node => {
      // 栈
      const stack = [];
      // 存所有节点
      const nodes = [];
      if (node) {
        stack.push(node);
        while (stack.length) {
          // 出栈
          const item = stack.pop();
          nodes.push(item);
          let children = item.children; // 获取子节点
          for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
          }
        }
      }
      return nodes;
    }
    console.log(dfs(node_parent));
    // BFS广度优先遍历 -> 队列
    const bfs = node => {
      // 栈
      const stack = [];
      // 存所有节点
      const nodes = [];
      if (node) {
        stack.push(node);
        while (stack.length) {
          // 从前往后取
          const item = stack.shift();
          nodes.push(item);
          let children = item.children;
          for (let i = 0; i < children.length; i++) {
            stack.push(children[i]);
          }
        }
      }
      return nodes;
    }
    console.log(bfs(node_parent));
  </script>
</body>
</html>
```

