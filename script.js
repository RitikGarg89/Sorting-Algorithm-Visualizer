// State Management
const container = document.getElementById('visualizer-container');
const startBtn = document.getElementById('start');
const generateBtn = document.getElementById('generate');
const algorithmSelect = document.getElementById('custom-algo-select');
const selectedAlgoText = document.getElementById('selected-algo-text');
const sizeSlider = document.getElementById('size');
const viewCodeBtn = document.getElementById('view-code');
const codeModal = document.getElementById('code-modal');
const closeModalBtn = document.getElementById('close-modal');
const codeDisplay = document.getElementById('code-display');
const modalTitle = document.getElementById('modal-title');
const langTabs = document.querySelectorAll('.lang-tab');
const stepText = document.getElementById('step-text');
const speedSlider = document.getElementById('speed');
const showValuesCheckbox = document.getElementById('show-values');
const statusText = document.getElementById('status-text');
const timeComplexityText = document.getElementById('time-complexity');
const spaceComplexityText = document.getElementById('space-complexity');

let array = [];
let isSorting = false;
let currentAlgorithm = 'bubble';
let currentLanguage = 'js';
let stepHistory = [];

// Complexity Info Mapping
const algorithmInfo = {
    bubble: {
        time: 'O(n²)',
        space: 'O(1)',
        code: {
            js: `async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            await markComparing([j, j + 1]);
            if (array[j] > array[j + 1]) {
                await swapBars(j, j + 1);
            }
            unmarkComparing([j, j + 1]);
        }
    }
}`,
            python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
            cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(arr[j], arr[j+1]);
}`,
            c: `void bubbleSort(int arr[], int n) {
    int i, j, temp;
    for (i = 0; i < n-1; i++) {
        for (j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
            java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
        }
    },
    quick: {
        time: 'O(n log n)',
        space: 'O(log n)',
        code: {
            js: `async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            await swapBars(i, j);
        }
    }
    await swapBars(i + 1, high);
    return i + 1;
}`,
            python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
            cpp: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}`,
            c: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return (i + 1);
}`,
            java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`
        }
    },
    merge: {
        time: 'O(n log n)',
        space: 'O(n)',
        code: {
            js: `async function mergeSort(l, r) {
    if (l >= r) return;
    let m = Math.floor(l + (r - l) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}

async function merge(l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = array.slice(l, m + 1);
    let R = array.slice(m + 1, r + 1);
    // ... merging logic with swapBars updates
}`,
            python: `def merge_sort(arr, l, r):
    if l < r:
        m = (l + r) // 2
        merge_sort(arr, l, m)
        merge_sort(arr, m + 1, r)
        merge(arr, l, m, r)

def merge(arr, l, m, r):
    n1 = m - l + 1
    n2 = r - m
    L = arr[l : m + 1]
    R = arr[m + 1 : r + 1]
    i, j, k = 0, 0, l
    while i < n1 and j < n2:
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1
    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1
    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1`,
            cpp: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`,
            c: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (i = 0; i < n1; i++) L[i] = arr[l + i];
    for (j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    i = 0; j = 0; k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`,
            java: `public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

public static void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int[] L = new int[n1];
    int[] R = new int[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`
        }
    },
    selection: {
        time: 'O(n²)',
        space: 'O(1)',
        code: {
            js: `async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let min = i;
        for (let j = i + 1; j < array.length; j++) {
            await markComparing([min, j]);
            if (array[j] < array[min]) min = j;
            unmarkComparing([min, j]);
        }
        if (min !== i) await swapBars(i, min);
    }
}`,
            python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
            cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`,
            c: `void selectionSort(int arr[], int n) {
    int i, j, min_idx, temp;
    for (i = 0; i < n-1; i++) {
        min_idx = i;
        for (j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
            java: `public static void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < arr.length; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`
        }
    },
    insertion: {
        time: 'O(n²)',
        space: 'O(1)',
        code: {
            js: `async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            await swapBars(j + 1, j);
            j = j - 1;
        }
        array[j + 1] = key;
    }
}`,
            python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
            cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
            c: `void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
            java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
        }
    },
    heap: {
        time: 'O(n log n)',
        space: 'O(1)',
        code: {
            js: `async function heapSort() {
    let n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
        await heapify(n, i);
    for (let i = n - 1; i > 0; i--) {
        await swapBars(0, i);
        await heapify(i, 0);
    }
}`,
            python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)`,
            cpp: `void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
            c: `void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`,
            java: `public void sort(int arr[]) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`
        }
    },
    shell: {
        time: 'O(n log n)',
        space: 'O(1)',
        code: {
            js: `async function shellSort() {
    let n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i += 1) {
            let temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                await swapBars(j, j - gap);
            }
            array[j] = temp;
        }
    }
}`,
            python: `def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2`,
            cpp: `void shellSort(int arr[], int n) {
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`,
            c: `void shellSort(int arr[], int n) {
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`,
            java: `public static void shellSort(int[] arr) {
    int n = arr.length;
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`
        }
    }
};

// Utilities
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getDelay() {
    // Invert the value: higher slider value = lower delay = faster speed
    // Slider range: 100 (Slow) - 1000 (Fast)
    // 1100 - 100 = 1000ms delay (Slower)
    // 1100 - 1000 = 100ms delay (Faster)
    return 1100 - parseInt(speedSlider.value);
}

function updateComplexityInfo() {
    timeComplexityText.innerText = algorithmInfo[currentAlgorithm].time;
    spaceComplexityText.innerText = algorithmInfo[currentAlgorithm].space;
}

// Utilities
function updateStepExplanation(text) {
    // Record step history
    stepHistory.push(text);

    stepText.classList.add('updating');
    setTimeout(() => {
        stepText.innerHTML = text;
        stepText.classList.remove('updating');
    }, 150);
}

// Array Generation
function generateRandomArray() {
    if (isSorting) return;

    container.innerHTML = '';
    array = [];
    stepHistory = []; // Reset history
    const size = sizeSlider.value;
    updateStepExplanation("New array generated. Choose an algorithm and click <strong>Start Sorting</strong>.");
    document.getElementById('show-summary').disabled = true;

    for (let i = 0; i < size; i++) {
        const val = Math.floor(Math.random() * 99) + 1; // Smaller range for blocks
        array.push(val);

        const bar = document.createElement('div');
        bar.classList.add('bar');

        // Dynamically calculate block size based on total bars and container width
        // Padding on container sides = ~20px * 2 = 40px
        const availableWidth = container.clientWidth - (size * 2) - 40;
        const maxBlockSize = Math.floor(availableWidth / size);
        const blockSize = Math.min(45, Math.max(18, maxBlockSize));

        bar.style.width = `${blockSize}px`;
        bar.style.height = `${blockSize}px`;
        bar.style.fontSize = `${blockSize * 0.45}px`;

        const span = document.createElement('span');
        span.classList.add('bar-value');
        span.innerText = val;
        bar.appendChild(span);

        container.appendChild(bar);
    }
    statusText.innerText = 'Ready to visualize';
    updateComplexityInfo();
}

// Visual Helpers
function getBars() {
    return document.getElementsByClassName('bar');
}

async function markComparing(indices) {
    const bars = getBars();
    indices.forEach(idx => bars[idx]?.classList.add('comparing'));
    await sleep(getDelay());
}

function unmarkComparing(indices) {
    const bars = getBars();
    indices.forEach(idx => bars[idx]?.classList.remove('comparing'));
}

async function updateSingleBar(index, value) {
    const bars = getBars();
    const bar = bars[index];
    bar.querySelector('.bar-value').innerText = value;
    bar.classList.add('swapping'); // Use swapping class for visual feedback on update
    await sleep(getDelay());
    bar.classList.remove('swapping');
}

async function swapBars(i, j) {
    const bars = getBars();
    const barOne = bars[i];
    const barTwo = bars[j];

    barOne.classList.add('swapping');
    barTwo.classList.add('swapping');

    // Calculate distance for animation
    const rectOne = barOne.getBoundingClientRect();
    const rectTwo = barTwo.getBoundingClientRect();
    const distance = rectTwo.left - rectOne.left;

    // Apply animation
    barOne.style.transform = `translateX(${distance}px)`;
    barTwo.style.transform = `translateX(${-distance}px)`;

    // Wait for transition to complete
    await sleep(400);

    // Swap actual text content and array values
    [array[i], array[j]] = [array[j], array[i]];
    const tempText = barOne.querySelector('.bar-value').innerText;
    barOne.querySelector('.bar-value').innerText = barTwo.querySelector('.bar-value').innerText;
    barTwo.querySelector('.bar-value').innerText = tempText;

    // Reset transforms instantly
    barOne.style.transition = 'none';
    barTwo.style.transition = 'none';
    barOne.style.transform = '';
    barTwo.style.transform = '';

    // Force reflow
    void barOne.offsetHeight;

    // Restore transitions
    barOne.style.transition = '';
    barTwo.style.transition = '';

    barOne.classList.remove('swapping');
    barTwo.classList.remove('swapping');
}

// --- Sorting Algorithms ---

// Bubble Sort
async function bubbleSort() {
    const bars = getBars();
    updateStepExplanation("Starting Bubble Sort: Larger values will 'bubble up' to the end of the array.");
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isSorting) return;

            updateStepExplanation(`Comparing <span class="highlight-text">${array[j]}</span> and <span class="highlight-text">${array[j + 1]}</span>`);
            await markComparing([j, j + 1]);

            if (array[j] > array[j + 1]) {
                updateStepExplanation(`<span class="highlight-text">${array[j]}</span> > <span class="highlight-text">${array[j + 1]}</span>. Swapping positions.`);
                await swapBars(j, j + 1);
            }

            unmarkComparing([j, j + 1]);
        }
        bars[array.length - i - 1].classList.add('sorted');
        updateStepExplanation(`Position <span class="highlight-text">${array.length - i - 1}</span> is now fully sorted.`);
    }
    bars[0].classList.add('sorted');
}

// Quick Sort
async function partition(low, high) {
    const bars = getBars();
    let pivot = array[high];
    updateStepExplanation(`Choosing <span class="highlight-text">${pivot}</span> as the pivot element.`);
    bars[high].classList.add('pivot'); // Pivot color

    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (!isSorting) return;
        updateStepExplanation(`Comparing <span class="highlight-text">${array[j]}</span> with pivot <span class="highlight-text">${pivot}</span>.`);
        await markComparing([j, high]);

        if (array[j] < pivot) {
            i++;
            if (i !== j) {
                updateStepExplanation(`<span class="highlight-text">${array[j]}</span> is smaller than pivot. Moving to left side.`);
                await swapBars(i, j);
            }
        }
        unmarkComparing([j, high]);
    }

    updateStepExplanation(`Placing pivot <span class="highlight-text">${pivot}</span> in its correct sorted position.`);
    await swapBars(i + 1, high);
    bars[high].classList.remove('pivot'); // Reset pivot color
    bars[i + 1].classList.add('sorted');
    return i + 1;
}

async function quickSort(low, high) {
    const bars = getBars();
    if (low < high) {
        updateStepExplanation(`Partitioning array from index <span class="highlight-text">${low}</span> to <span class="highlight-text">${high}</span>.`);
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);

        // Visual mark for sorted range
        // This part is handled by partition now, but ensure all are marked if sub-arrays are fully sorted
        // for (let k = low; k <= high; k++) bars[k].classList.add('sorted');
    } else if (low >= 0 && high >= 0 && low < array.length) { // Handle single element sub-arrays
        bars[low]?.classList.add('sorted');
    }
}

// Merge Sort
async function merge(l, m, r) {
    const bars = getBars();
    updateStepExplanation(`Merging two sorted subarrays back together.`);
    let n1 = m - l + 1;
    let n2 = r - m;

    let L = array.slice(l, m + 1);
    let R = array.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
        if (!isSorting) return;
        updateStepExplanation(`Comparing <span class="highlight-text">${L[i]}</span> from left and <span class="highlight-text">${R[j]}</span> from right.`);
        await markComparing([l + i, m + 1 + j]);

        if (L[i] <= R[j]) {
            array[k] = L[i];
            updateStepExplanation(`Placing <span class="highlight-text">${L[i]}</span> back in the main array.`);
            await updateSingleBar(k, L[i]);
            i++;
        } else {
            array[k] = R[j];
            updateStepExplanation(`Placing <span class="highlight-text">${R[j]}</span> back in the main array.`);
            await updateSingleBar(k, R[j]);
            j++;
        }
        unmarkComparing([l + i - 1, m + 1 + j - 1]); // Unmark previous comparison
        bars[k].classList.add('sorted'); // Mark as sorted once placed
        k++;
    }

    while (i < n1) {
        array[k] = L[i];
        await updateSingleBar(k, L[i]);
        bars[k].classList.add('sorted');
        i++; k++;
    }

    while (j < n2) {
        array[k] = R[j];
        await updateSingleBar(k, R[j]);
        bars[k].classList.add('sorted');
        j++; k++;
        await sleep(getDelay());
    }

    for (let x = l; x <= r; x++) bars[x].classList.add('sorted');
}

async function mergeSort(l, r) {
    if (l >= r) return;
    let m = Math.floor(l + (r - l) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}

// Selection Sort
async function selectionSort() {
    const bars = getBars();
    updateStepExplanation("Starting Selection Sort: Finding the minimum element in each pass.");
    for (let i = 0; i < array.length; i++) {
        let min = i;
        updateStepExplanation(`Assume <span class="highlight-text">${array[i]}</span> is the minimum.`);
        for (let j = i + 1; j < array.length; j++) {
            if (!isSorting) return;
            updateStepExplanation(`Checking if <span class="highlight-text">${array[j]}</span> is smaller than current min <span class="highlight-text">${array[min]}</span>.`);
            await markComparing([min, j]);

            if (array[j] < array[min]) {
                min = j;
                updateStepExplanation(`New minimum found: <span class="highlight-text">${array[min]}</span>.`);
            }
            unmarkComparing([min, j]);
        }
        if (min !== i) {
            updateStepExplanation(`Swapping <span class="highlight-text">${array[i]}</span> with the minimum <span class="highlight-text">${array[min]}</span>.`);
            await swapBars(i, min);
        }
        bars[i].classList.add('sorted');
    }
}

// Insertion Sort
async function insertionSort() {
    const bars = getBars();
    updateStepExplanation("Starting Insertion Sort: Building a sorted sub-list one element at a time.");
    bars[0].classList.add('sorted');
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        updateStepExplanation(`Inserting <span class="highlight-text">${key}</span> into the sorted portion.`);

        while (j >= 0 && array[j] > key) {
            if (!isSorting) return;
            updateStepExplanation(`<span class="highlight-text">${array[j]}</span> > <span class="highlight-text">${key}</span>. Shifting <span class="highlight-text">${array[j]}</span> to the right.`);
            await markComparing([j, j + 1]);
            await swapBars(j + 1, j);
            unmarkComparing([j, j + 1]);
            j = j - 1;
        }
        array[j + 1] = key;
        for (let k = 0; k <= i; k++) bars[k].classList.add('sorted');
    }
}

// Heap Sort
async function heapify(n, i) {
    const bars = getBars();
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n) {
        updateStepExplanation(`Comparing parent <span class="highlight-text">${array[largest]}</span> with left child <span class="highlight-text">${array[l]}</span>.`);
        await markComparing([largest, l]);
        if (array[l] > array[largest]) largest = l;
        unmarkComparing([largest, l]);
    }

    if (r < n) {
        updateStepExplanation(`Comparing current largest <span class="highlight-text">${array[largest]}</span> with right child <span class="highlight-text">${array[r]}</span>.`);
        await markComparing([largest, r]);
        if (array[r] > array[largest]) largest = r;
        unmarkComparing([largest, r]);
    }

    if (largest !== i) {
        updateStepExplanation(`Swapping <span class="highlight-text">${array[i]}</span> with its largest child <span class="highlight-text">${array[largest]}</span>.`);
        await swapBars(i, largest);
        await heapify(n, largest);
    }
}

async function heapSort() {
    const bars = getBars();
    let n = array.length;
    updateStepExplanation("Starting Heap Sort: Building a Max Heap.");
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (!isSorting) return;
        await heapify(n, i);
    }

    updateStepExplanation("Heap built. Extracting elements one by one.");
    for (let i = n - 1; i > 0; i--) {
        if (!isSorting) return;
        updateStepExplanation(`Moving max element <span class="highlight-text">${array[0]}</span> to the end.`);
        await swapBars(0, i);
        bars[i].classList.add('sorted');
        await heapify(i, 0);
    }
    bars[0].classList.add('sorted');
}

// Shell Sort
async function shellSort() {
    const bars = getBars();
    let n = array.length;
    updateStepExplanation("Starting Shell Sort: A generalized version of Insertion Sort using 'gaps'.");
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        updateStepExplanation(`Current gap size: <span class="highlight-text">${gap}</span>.`);
        for (let i = gap; i < n; i += 1) {
            let temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                if (!isSorting) return;
                updateStepExplanation(`Comparing <span class="highlight-text">${array[j - gap]}</span> with <span class="highlight-text">${temp}</span> at gap <span class="highlight-text">${gap}</span>.`);
                await markComparing([j, j - gap]);
                await swapBars(j, j - gap);
                unmarkComparing([j, j - gap]);
            }
            array[j] = temp;
        }
    }
    for (let x = 0; x < n; x++) bars[x].classList.add('sorted');
}


// Summary Modal Logic
const summaryModal = document.getElementById('summary-modal');
const closeSummaryBtn = document.getElementById('close-summary');
const showSummaryBtn = document.getElementById('show-summary');
const summaryList = document.getElementById('summary-list');

function openSummaryModal() {
    summaryList.innerHTML = '';
    stepHistory.forEach((step, index) => {
        const item = document.createElement('div');
        item.classList.add('summary-item');
        item.innerHTML = `<span class="step-id">${index + 1}</span> <p>${step}</p>`;
        summaryList.appendChild(item);
    });
    summaryModal.classList.add('active');
}

showSummaryBtn.addEventListener('click', openSummaryModal);
closeSummaryBtn.addEventListener('click', () => summaryModal.classList.remove('active'));
summaryModal.addEventListener('click', (e) => {
    if (e.target === summaryModal) summaryModal.classList.remove('active');
});

// Main Execution
async function startApplication() {
    if (isSorting) return;

    isSorting = true;
    stepHistory = [];
    document.getElementById('show-summary').disabled = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    sizeSlider.disabled = true;
    algorithmSelect.disabled = true;

    // Clear previous sorted styles if any
    const bars = getBars();
    for (let bar of bars) {
        bar.classList.remove('sorted');
    }

    statusText.innerText = 'Sorting in progress...';
    const algo = currentAlgorithm;

    try {
        if (algo === 'bubble') {
            await bubbleSort();
        } else if (algo === 'selection') {
            await selectionSort();
        } else if (algo === 'insertion') {
            await insertionSort();
        } else if (algo === 'quick') {
            await quickSort(0, array.length - 1);
        } else if (algo === 'merge') {
            await mergeSort(0, array.length - 1);
        } else if (algo === 'heap') {
            await heapSort();
        } else if (algo === 'shell') {
            await shellSort();
        }
    } catch (err) {
        console.error("Sorting interrupted or failed:", err);
    }

    isSorting = false;
    startBtn.disabled = false;
    generateBtn.disabled = false;
    sizeSlider.disabled = false;
    algorithmSelect.disabled = false;
    document.getElementById('show-summary').disabled = false; // Enable summary button
    statusText.innerText = 'Sorting complete!';
}

// Custom Dropdown Logic
algorithmSelect.addEventListener('click', (e) => {
    if (isSorting) return;
    algorithmSelect.classList.toggle('active');
});

const options = algorithmSelect.querySelectorAll('.option');
options.forEach(option => {
    option.addEventListener('click', (e) => {
        const val = option.getAttribute('data-value');
        currentAlgorithm = val;

        // Update UI
        selectedAlgoText.innerText = option.innerText;
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        updateComplexityInfo();
    });
});

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (!algorithmSelect.contains(e.target)) {
        algorithmSelect.classList.remove('active');
    }
});

// Modal Logic
function updateModalCode() {
    codeDisplay.innerText = algorithmInfo[currentAlgorithm].code[currentLanguage];
}

viewCodeBtn.addEventListener('click', () => {
    modalTitle.innerText = `${selectedAlgoText.innerText} Implementation`;
    updateModalCode();
    codeModal.classList.add('active');
});

langTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        currentLanguage = tab.getAttribute('data-lang');
        langTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updateModalCode();
    });
});

closeModalBtn.addEventListener('click', () => {
    codeModal.classList.remove('active');
});

codeModal.addEventListener('click', (e) => {
    if (e.target === codeModal) {
        codeModal.classList.remove('active');
    }
});

// Event Listeners
generateBtn.addEventListener('click', generateRandomArray);
startBtn.addEventListener('click', startApplication);
sizeSlider.addEventListener('input', generateRandomArray);

// Initial Load
window.onload = generateRandomArray;
