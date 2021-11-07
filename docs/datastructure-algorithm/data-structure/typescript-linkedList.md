# 使用Typescript实现LinkedList

### 完整代码

``` typescript
class Node {
  /**
   * 上一个节点
   */
  private prev: Node | null = null;
  /**
   * 当前节点信息
   */
  private data: any;
  /**
   * 下一个节点
   */
  private next: Node | null = null;

  public getPrev() {
    return this.prev;
  }

  public setPrev(prev: Node | null) {
    return this.prev = prev;
  }

  public getData() {
    return this.data;
  }

  public setData(data: any) {
    return this.data = data;
  }

  public getNext() {
    return this.next;
  }

  public setNext(next: Node | null) {
    return this.next = next;
  }
}

class LinkedList {
  /**
   * 开始节点
   */
  private first: Node | null = null;
  /**
   * 最后节点
   */
  private last: Node | null = null;

  /**
   * 长度
   */
  private size: number = 0

  /**
   * 往最后添加节点
   * @param data 节点信息
   */
  public add(data: any): void {
    const n: Node = new Node();
    if (this.first === null) {
      n.setPrev(null);
      n.setData(data);
      n.setNext(null);

      this.first = n;
      this.last = n;
    } else {
      n.setPrev(this.last);
      n.setData(data);
      n.setNext(null);

      this.last!.setNext(n);

      this.last = n;
    }
    this.size++;
  }

  /**
   * 往指定位置添加节点
   * @param index 节点位置
   * @param data 节点信息
   */
  public addToIndex(index: number, data: any): void {
    this.rangeCheck(index);

    const n = this.node(index);

    const newNode: Node = new Node();
    newNode.setData(data);

    if (n !== null) {
      const prev = n.getPrev();
      prev!.setNext(newNode);
      newNode.setPrev(prev);

      n.setPrev(newNode);
      newNode.setNext(n);

      this.size++;
    }
  }

  /**
   * 移除指定位置的节点
   * @param index 节点位置
   */
  public remove(index: number): any {
    const n: Node | null = this.node(index);

    if (n != null) {
      const prev = n.getPrev();
      const next = n.getNext();

      prev!.setNext(next);
      next!.setPrev(prev);

      this.size--;
    }

    return n!.getData();
  }

  /**
   * 获取指定位置节点信息
   * @param index 节点位置
   */
  public get(index: number): any {
    this.rangeCheck(index);
    return this.node(index)!.getData();
  }

  /**
   * 设置指定位置节点信息
   * @param index 节点位置
   * @param data 节点信息
   */
  public set(index: number, data: any): void {
    this.rangeCheck(index);

    const n: Node | null = this.node(index);
    if (n !== null) n.setData(data);
  }

  public [Symbol.iterator](): any {
    const that = this;
    let currentNode: Node | null = null;
    return {
      next() {
        currentNode = currentNode ? currentNode.getNext() : that.first;
        if (currentNode !== null) {
          return { value: currentNode.getData(), done: false };
        } else {
          return { value: undefined, done: true };
        }
      }
    }
  }

  private node(index: number): Node | null {
    let n: Node | null = null;
    if (this.first !== null) {
      n = this.first;
      for (let i: number = 0; i < index; i++) {
        n = n!.getNext();
      }
    }
    return n
  }

  private rangeCheck(index: number): void {
    if (index < 0 || index >= this.size) {
      throw new Error('Subscript out of bounds');
    }
  }
}

export default LinkedList;
```

<Vssue :title="$title" />