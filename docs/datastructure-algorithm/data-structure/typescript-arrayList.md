# 使用Typescript实现ArrayList

> 完整代码

``` typescript
class ArrayList<E> {

  /**
   * 元素的数量
   */
  private sizeNum:number = 0;

  /**
   * 所有的元素
   */
  private elements:E[] = [];

  private static readonly DEFAULT_CAPACITY = 10;
  private static readonly ELEMENT_NOT_FOUND = -1;
  
  constructor(capaticy?:number) {
    capaticy = (capaticy < ArrayList.DEFAULT_CAPACITY) ? ArrayList.DEFAULT_CAPACITY : capaticy;
    this.elements = new Array<E>(capaticy);
  }

  /**
   * 清除所有元素
   */
  public clear() {
    for (let i = 0; i < this.sizeNum; i++) {
      this.elements[i] = null;
    }
    this.sizeNum = 0;
  }

  /**
   * 获取元素的数量
   * @return
   */
  public size():number {
    return this.sizeNum;
  }

  /**
   * 判断是否为空
   * @return
   */
  public isEmpty():boolean {
    return this.sizeNum === 0;
  }

  /**
   * 是否包含某个元素
   * @return
   */
  public contains(element:E):boolean {
    return this.indexOf(element) != ArrayList.ELEMENT_NOT_FOUND;
  }

  /**
   * 添加元素到尾部
   * @param element
   */
  public add(element:E) {
    this.addToIndex(this.sizeNum, element);
  }

  /**
   * 获取index位置的元素
   * @param index
   */
  public get(index:number):E {
    this.rangeCheck(index);
    return this.elements[index];
  }

  /**
   * 设置index位置的元素
   * @param index
   * @param element
   */
  public set(index:number, element:E):E {
    this.rangeCheck(index);
    const old:E = this.elements[index];
    this.elements[index] = element;
    return old;
  }

  /**
   * 在index位置插入一个元素
   * @param index
   * @param element
   */
  public addToIndex(index:number, element:E) {
    this.rangeCheckAdd(index);

    this.ensureCapacity(index + 1);

    for (let i = this.sizeNum - 1; i > index; i--) {
      this.elements[i] = this.elements[i - 1];
    }
    this.elements[index] = element;
    this.sizeNum++;
  }

  /**
   * 删除index位置的元素
   * @param index
   */
  public remove(index:number):E {
    this.rangeCheck(index);
    const oldElement:E = this.elements[index];
    for (let i = this.sizeNum; i > index; i--) {
      this.elements[i] = this.elements[i - 1];
    }
    this.sizeNum--;
    return oldElement;
  }

  /**
   * 查看元素的索引
   * @param element
   */
  public indexOf(element:E):number {
    return ArrayList.ELEMENT_NOT_FOUND;
  }

  private outOfBounds(index:number) {
    throw new Error(`ArrayIndexOutOfBoundsException: ${index}`);
  }

  private rangeCheck(index:number) {
    if (index < 0 || index >= this.sizeNum) {
      this.outOfBounds(index);
    }
  }

  private rangeCheckAdd(index:number) {
    if (index < 0 || index > this.sizeNum) {
      this.outOfBounds(index);
    }
  }

  /**
   * 保证要有capacity的容量
   * @param capacity
   */
  public ensureCapacity(capacity:number) {
    const oldCapacity = this.elements.length;
    if (oldCapacity > capacity) return;

    const newCapacity = oldCapacity + (oldCapacity >> 1);
    const newElements:E[] = new Array<E>(newCapacity);
    for (let i = 0; i< this.sizeNum; i++) {
      newElements[i] = this.elements[i];
    }
    this.elements = newElements;
  }

  public toString():string {
    let str:string = '';
    str += `size=${this.sizeNum}, [`;
    for (let i = 0; i < this.sizeNum; i++) {
      if (i !== 0) {
        str += ',';
      }
      str += this.elements[i];
    }
    str += ']'
    return str;
  }
}

export default ArrayList;
```

<Vssue :title="$title" />