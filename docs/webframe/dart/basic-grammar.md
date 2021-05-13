# dart基础语法

> 数据类型

dart的数据类型有数字（int、double）、字符串（String）、布尔（bool）与集合类型（List、Set、Map）。

类型的用法和其它的语言大体一致，区别在于布尔类型，在dart中不存在非0即真, 或者非空即真，在判断时的条件必须为true或false。

在开发中经常会有字符串拼接的需求，可以使用`${expression}`的方式进行拼接，如果表达式只是一个标识符，那么`{}`是可以省略。

```dart
var name = 'Jerry';
vat age = 18
print('my name is ${name}, age is $age, current time ${DateTime.now()}')
```



> 定义变量

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

> 函数的定义

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
int sum(int num1, int num2) => num1 + num2;
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

在dart中可以嫁给你函数赋值给一个变量，也可以将函数作为参数或者返回值来使用（与Javascript类似，同时也有匿名函数、词法作用域、闭包等概念）。

> 运算符

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

main(List<String> args) {
    var p = Person()
        		..name = 'Jerry'
        		..run()
        		..eat();
}
```

> 流程控制

流程控制与大部分语言相似，唯一不同点就是上面提到的不支持非空即真或者非0即真，必须有明确的bool类型。

> 类和对象