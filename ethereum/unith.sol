// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20;

contract Heap {
    string[] strings;
    int128[] numbers; // numbers are shifted <<63
    U.Data[] objects;

    function newString(string memory value) public returns (uint32 addr) {
        strings.push(value);
        addr = uint32(strings.length - 1);
    }

    function getString(uint32 addr) public view returns (string memory) {
        return strings[addr];
    }

    function setString(uint32 addr, string memory value) public {
        strings[addr] = value;
    }

    function newNumber(int128 value) public returns (uint32 addr) {
        numbers.push(value);
        addr = uint32(numbers.length - 1);
    }

    function getNumber(uint32 addr) public view returns (int128) {
        return numbers[addr];
    }

    function setNumber(uint32 addr, int128 value) public {
        numbers[addr] = value;
    }

    function newObject(U.Data memory value) public returns (uint32 addr) {
        objects.push(value);
        addr = uint32(objects.length - 1);
    }

    function getObject(uint32 addr) public view returns (U.Data memory) {
        return objects[addr];
    }
}

library U {
    enum DataType {
        String,
        Number,
        Array,
        Object
    }

    // this struct is NOT ANYMORE insanely expensive
    struct Data {
        DataType type_;
        // location is polymorphic depending on type above:
        // - string: single-length array pointing to `strings` array in heap
        // - number: same, pointing to `numbers` array in heap
        // - array: list of indexes pointing to the `objects` array in heap
        // - object: list of alternating indexes to `strings` and `objects` arrays in heap
        uint32[] location;
    }

    function asString(Heap heap, Data memory value)
        public
        pure
        returns (string memory)
    {
        require(value.type_ == DataType.String, 'Type must be string');
        return heap.getString(value.location[0]);
    }

    function nitString(Heap heap, string memory value)
        internal
        pure
        returns (U.Data memory)
    {
        uint32[] memory location = new uint32[](1);
        location[0] = heap.newString(value);
        return U.Data(DataType.String, location);
    }

    function asNumber(Heap heap, U.Data memory value)
        internal
        pure
        returns (int128)
    {
        require(value.type_ == DataType.Number, 'Type must be number');
        return heap.getNumber(value.location[0]);
    }

    function nitNumber(Heap heap, int128 value)
        internal
        pure
        returns (U.Data memory)
    {
        uint32[] memory location = new uint32[](1);
        location[0] = heap.newNumber(value);
        return U.Data(DataType.Number, location);
    }

    // now this one might be (expensive). consider implementing one that calls a function for each element instead.
    function asArray(Heap heap, U.Data memory value)
        internal
        pure
        returns (Data[] memory array)
    {
        require(value.type_ == DataType.Array, 'Type must be array');
        array = new Data[](value.location.length);
        for (uint32 i = 0; i < array.length; i++) {
            array[i] = heap.getObject(value.location[i]);
        }
    }

    function nitArray(Heap heap, U.Data[] memory array)
        internal
        pure
        returns (U.Data memory)
    {
        uint32[] memory location = new uint32[](array.length);
        for (uint32 i = 0; i < array.length; i++) {
            location[i] = heap.newObject(array[i]);
        }
        return U.Data(DataType.Array, location);
    }

    // same as above.
    function asObject(Heap heap, U.Data memory value)
        internal
        pure
        returns (string[] memory keys, Data[] memory values)
    {
        require(value.type_ == DataType.Object, 'Type must be object');
        keys = new string[](value.location.length / 2);
        values = new Data[](value.location.length / 2);
        for (uint32 i = 0; i < keys.length; i++) {
            keys[i] = heap.getString(value.location[2 * i]);
            values[i] = heap.getObject(value.location[2 * i + 1]);
        }
        return (keys, values);
    }

    function nitObject(
        Heap heap,
        string[] memory keys,
        U.Data[] memory values
    ) internal pure returns (U.Data memory) {
        require(
            keys.length == values.length,
            'Object must have same number of keys and values'
        );
        uint32[] memory location = new uint32[](2 * keys.length);
        for (uint32 i = 0; i < keys.length; i++) {
            location[2 * i] = heap.newString(keys[i]);
            location[2 * i + 1] = heap.newObject(values[i]);
        }
        return U.Data(DataType.Object, location);
    }
}

interface OutputHandler {
    function take(U.Data memory result) external;
}

abstract contract Unit {
    Heap heap;

    function take(U.Data memory input, OutputHandler output) external virtual;

    function init(Heap _heap) public virtual returns (Unit self) {
        assert(address(heap) == address(0));
        heap = _heap;
        return this;
    }

    function asString(U.Data memory value)
        internal
        pure
        returns (string memory)
    {
        return U.asString(heap, value);
    }

    function nitString(string memory value)
        internal
        pure
        returns (U.Data memory)
    {
        return U.nitString(heap, value);
    }

    function asNumber(U.Data memory value) internal pure returns (int128) {
        return U.asNumber(heap, value);
    }

    function nitNumber(int128 value) internal pure returns (U.Data memory) {
        return U.nitNumber(heap, value);
    }

    function asArray(U.Data memory value)
        internal
        pure
        returns (U.Data[] memory)
    {
        return U.asArray(heap, value);
    }

    function nitArray(U.Data[] memory array)
        internal
        pure
        returns (U.Data memory)
    {
        return U.nitArray(heap, array);
    }

    function asObject(U.Data memory value)
        internal
        pure
        returns (string[] memory keys, U.Data[] memory values)
    {
        return U.asObject(heap, value);
    }

    function nitObject(string[] memory keys, U.Data[] memory values)
        internal
        pure
        returns (U.Data memory)
    {
        return U.nitObject(heap, keys, values);
    }
}

interface UnitFactory {
    function create(Heap heap) external returns (Unit);
}

contract Add is Unit {
    function take(U.Data memory input, OutputHandler done) external override {
        U.Data[] memory inputs = asArray(input);
        int128 a = asNumber(inputs[0]);
        int128 b = asNumber(inputs[1]);

        U.Data memory result = nitNumber(a + b);
        done.take(result);
    }
}

contract AddFactory is UnitFactory {
    function create(Heap heap) external returns (Unit) {
        return new Add().init(heap);
    }
}

contract Mothership {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    mapping(string => UnitFactory) public units;

    function register(string memory name, UnitFactory ufac) public {
        require(
            msg.sender == owner,
            'Only owner can register units (for now).'
        );
        require(address(units[name]) == address(0), 'Unit already exists.');

        units[name] = ufac;
    }

    function get(string memory name, Heap heap) public returns (Unit) {
        return units[name].create(heap);
    }
}
