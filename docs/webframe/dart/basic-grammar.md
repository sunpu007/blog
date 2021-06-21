# Dart基础语法

## 认识dart

Dart 是由谷歌开发的通用的编程语言，它常用于构建web、服务器、桌面和移动应用程序。

Dart是一种简洁、清晰、基于类的面向对象的语言，它是基于JavaScript的大三女生结构要比JavaScript要多。

Dart是一种面向对象的、类定义的、垃圾回收语言。它支持接口、mixin、类对象，具有化泛型、静态类型等。

## 数据类型

dart的数据类型有数字（int、double）、字符串（String）、布尔（bool）与集合类型（List、Set、Map）。

类型的用法和其它的语言大体一致，区别在于布尔类型，在dart中不存在非0即真, 或者非空即真，在判断时的条件必须为true或false。

在开发中经常会有字符串拼接的需求，可以使用`${expression}`的方式进行拼接，如果表达式只是一个标识符，那么`{}`是可以省略。

```dart
var name = 'Jerry';
vat age = 18
print('my name is ${name}, age is $age, current time ${DateTime.now()}')
```



## 定义变量

变量的声明格式如下：

```dart
变量类型 变量名称 = 变量值
```

示例代码：

```dart
// 明确声明
String name = 'Jerry';
int age = 18;

// 类型推导

// 使用`var`声明变量
// 变量在声明时会根据所赋值推断出当前类型
var name = 'Jerry';
// 声明并赋值后就不能将其他类型的值赋予当前变量，否则出现编译错误(与Typescript相似)
// name = 18;

// 使用`dynamic`声明变量
// 见名知意，使用dynamic声明的变量并不会固定变量的类型，但是会带来一些潜在危险（在开发中不建议使用）
dynamic name = 'Jerry';
name = 18;

// 使用`final`与`const`声明变量
// final与const都是用来定义常量的，也就是定义值后不能修改
final name = 'Jerry';
const age = 18;
// final与const的区别在于：
// const必须在编译期间就确定它的值
// final可以动态获取，也就是运行时确定值
// const name = DateTime.now(); // 错误的赋值方式
final name = DateTime.now();
```

## 函数的定义

函数的定义方式如：

```dart
返回值类型 函数的名称(参数列表) {
  函数体
  return 返回值
}
```

示例代码：

```dart
int sum(int num1, int num2) {
  return num1 + num2;
}

// 上面的代码也可以使用箭头语法来表示，但需要注意的是里面只能是一个表达式，不能是一个语句（与ES6还是有区别）
int sum(int num1, int num2) =## num1 + num2;
```

函数的参数可分为两类：必选参数与可选参数。

可选参数又可以分为`命名可选参数`与`位置可选参数`，定义方式如下：

```dart
命名可选参数：{param1， param2, ...}
位置可选参数：[param1， param2, ...]
```

示例代码：

```dart
void test(String name, {int:age, double height}) {
  print('$name $age $height')
}
```

参数也可以了设置默认值。

```dart
void test(String name, {int:age = 18, double height = 1.88}) {
	print('$name $age $height')
}
```

在dart中可以嫁给你函数赋值给一个变量，也可以将函数作为参数或者返回值来使用（*与Javascript类似，同时也有匿名函数、词法作用域、闭包等概念*）。

## 运算符

dart除了加减乘除、取模等运算符之外，还有`??=`（赋值运算符）、`??`（条件运算符）、`..`（级联运算符）等。

```dart
// `??=`（赋值运算符）
var name = 'Jerry';
var name2 = null;
// 当变量为null时奖后的内容赋值到当前变量
// 当变量有值时使用原有的值
name2 ??= name;

// `??`（条件运算符）
var name = null;
// 当name变量为null时，使用后的值进行赋值
// 当name变量有值时，使用name的值进行赋值
var temp = name ?? 'Jerry'

// `..`（级联运算符）
// 相当于Javascript的链式调用
class Person {
  String name;
  void run() {
    print('$name is running');
  }
  void eat() {
    print('$name is eatting');
  }
}

main(List<String## args) {
  var p = Person()
        		..name = 'Jerry'
        		..run()
        		..eat();
}
```

## 流程控制

流程控制与大部分语言相似，唯一不同点就是上面提到的不支持非空即真或者非0即真，必须有明确的bool类型。

## 类和对象

::: tip

Dart是一个面向对象的语言，面向对象中非常重要的概念就是类，类产生了对象。

:::

类通常有两部分组成：成员（member）和方法（method）。

类的定义方式如：

```dart
class 类名 {
  类型 成员名;
  返回值类型 方法名() {
    方法体
  }
}
```

类的定义与创建对应的对象

```dart
main(List<String args##) {
  // 创建类的对象
  var p = new Person(); // 直接使用Person()也可以创建
  // 对象的属性赋值
  p.name = 'Jerry';
  // 调用对象方法
  p.run();
}

// 类的定义
class Person {
  String name;
  
  run() {
    print('$name is running');
  }
}

// 我们也可以使用static关键字来定义静态方法或属性
class Student {
  String name;
  int sno;

  static String time;

  study() {
    print('$name在学习');
  }

  static attendClass() {
    print('去上课');
  }
}
```

### 构造方法

在定义时并没有手动拆功能键类的构造方法时，系统会自动创建一个默认的无参构造方法（*上面的Person中我们就没有定义构造方法，在创建类的对象时调用的时默认无参构造方法*）。

我们也可以根据自己的业务需求，定义自己的构造方法（*需要注意的是：当我们手动定义了构造方法后，默认的无参构造方法会失效，还有就是dart中没有重载的概念，所以一个类只能定义一个构造方法。当然我们也可以使用其它方式定义其它构造方法，下面会讲*）。

```dart
// 普通构造方法
class Person {
  String name;
  
  // Person(String name) {
    // this.name = name
  // }
  // 实现构造方法是，基本上都是传参赋值，我们也可以使用另一种更加简洁的语法糖形式
  Person(this.name);
  
  run() {
    print('$name is running');
  }
}

// 命名构造方法
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  // 可以通过这样的方式来实现构造方法的重载问题
  Person.withName(String name) {
    this.name = name;
    this.age = 0;
  }

  Person.withArgments(Map<String, Object## map) {
    this.name = map['name'];
    this.age = map['age'];
  }
  
  run() {
    print('$name is running');
  }
}
var p = Person.withName('Jerry');
var p1 = Person.withArgments({'name': 'Jerry', 'age': 18});

// 初始化列表
// 我们有时会存在通过传入的值计算出另一个值的情况
class Point {
  final num x;
  final num y;
  final num distance;

  // 错误写法
  // Point(this.x, this.y) {
  //   distance = sqrt(x * x + y * y);
  // }

  // 正确的写法
  Point(this.x, this.y) : distance = sqrt(x * x + y * y);
}

// 重定向构造方法
class Person {
  String name;
  int age;

  Person(this.name, this.age);
  Person.fromName(String name) : this(name, 0);
}

// 常量构造方法
// 我们有时会存在传入相同的值时，返回的对象时同一个，这时我们就需要使用常量构造方法
// 需要注意的是：拥有常量构造方法的类中，所有的成员变量必须用final修饰；为了可以通过常量构造方法，创建出相同的对象，不再使用 new关键字，而是使用const关键字
// 如果是将结果赋值给const修饰的标识符时，const可以省略.
main(List<String## args) {
  var p1 = const Person('why');
  var p2 = const Person('why');
  print(identical(p1, p2)); // true
}

class Person {
  final String name;

  const Person(this.name);
}

// 工厂构造方法
// 使用`factory`修饰的构造函数被称之为工厂构造方法，工厂构造方法允许有返回值
main(List<String## args) {
  var p1 = Person('why');
  var p2 = Person('why');
  print(identical(p1, p2)); // true
}

class Person {
  String name;

  static final Map<String, Person## _cache = <String, Person##{};

  factory Person(String name) {
    if (_cache.containsKey(name)) {
      return _cache[name];
    } else {
      final p = Person._internal(name);
      _cache[name] = p;
      return p;
    }
  }

  Person._internal(this.name);
}
```

### setting和getting

通常我们虚妄对类的属性进行监控就可以使用`setting`和`getting`。

```dart
main(List<String## args) {
  final d = Dog("黄色");
  d.setColor = "黑色";
  print(d.getColor);
}

class Dog {
  String color;

  String get getColor =## color;
  set setColor(String color) =## this.name = name;
  Dog(this.color);
}
```

### 类的继承

继承不仅仅可以减少代码量，也是多态的使用前提。

```dart
main(List<String## args) {
  var p = new Person();
  p.age = 18;
  p.run();
}

class Animal {
  int age;

  run() {
    print('在奔跑ing');
  }
}

class Person extends Animal {
}

// 子类可以拥有自己的成员变量，也可以对父类的方法进行重写
class Person extends Animal {
  String name;

  @override
  run() {
    print('$name在奔跑ing');
  }
}

// 子类可以调用弗雷的构造方法，进行父类属性的初始化
// 默认情况下，子类的构造方法在执行前会隐式的调用父类的无参构造方法
// 如果父类没有无参默认构造方法时，子类必须在初始化的时候通过`super`显式的调用父类某个构造方法
class Animal {
  int age;

  Animal(this.age);

  run() {
    print('在奔跑ing');
  }
}

class Person extends Animal {
  String name;

  Person(String name, int age) : name=name, super(age);

  @override
  run() {
    print('$name在奔跑ing');
  }

  @override
  String toString() {
    return 'name=$name, age=$age';
  }
}
```

### 抽象类

抽象类与其它语言一直，就不做介绍了

### 隐式接口

dart中并没有一个关键字来定义接口，默认情况下，所有类都属于接口（dart不支持多继承）

```dart

abstract class Runner {
  run();
}

abstract class Flyer {
  fly();
}

class SuperMan implements Runner, Flyer {
  @override
  run() {
    print('超人在奔跑');
  }

  @override
  fly() {
    print('超人在飞');
  }
}
```

### Mixin混入

在通过implements实现某个类时，类中所有的方法都必须`被重新实现`(无论这个类原来是否已经实现过该方法)。但是某些情况下，一个类可能希望直接复用之前类的原有实现方案，但是dart只支持单继承，所以提供了另一种方案`Mixin`(使用功能与Vue相似)

```dart
mixin Runner {
  run() {
    print('在奔跑');
  }
}

mixin Flyer {
  fly() {
    print('在飞翔');
  }
}

class SuperMain with Runner, Flyer {
}
```

### 枚举类型

枚举的使用与其它语言相似，但需要注意的是：不能子类化、混合或实现枚举；不能显式实例化一个枚举。

## 扩展（dart >= 2.6.0）

在通常开发中，我们可能需要对某个类进行扩展一些方法，dart给我们提供了`extension`关键字（类似于Javascript中的prototype）

```dart
extension intFit on int {
  // 扩展一个方法
  void demoFn() {
    // ...body
  }
  int demoFn() {
    // ...body
    return this
  }
  // 扩展一个getter
  int get demoGet {
    // ...body
    return this
  }
}
```



<Vssue :title="$title" /##