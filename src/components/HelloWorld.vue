<template>
    <div style="text-align: left; margin-bottom: 10px">
        <el-input
            style="width: 200px; margin-right: 10px"
            v-model="name"
            placeholder="请输入内容"
        ></el-input>
        <el-button size="large" style="margin-right: 4px" @click="add"
            >新增
        </el-button>
        <el-badge class="item" :value="unCompleteNum">
            <el-button
                size="large"
                @click="showNotComplete"
                :autofocus="options == 'unCompleted' ? true : false"
                >未完成</el-button
            >
        </el-badge>
        <el-badge class="item" :value="completeNum">
            <el-button
                size="large"
                @click="showComplete"
                :autofocus="options == 'completed' ? true : false"
                >已完成</el-button
            >
        </el-badge>
        <el-badge class="item" :value="allNum">
            <el-button
                size="large"
                @click="showAll"
                :autofocus="options == 'all' ? true : false"
                >所有</el-button
            >
        </el-badge>
    </div>
    <el-table
        :data="
            filtersTableData.filter(
                (data) =>
                    !search ||
                    data.name.toLowerCase().includes(search.toLowerCase())
            )
        "
        style="width: 40%"
    >
        <el-table-column prop="name" label="姓名"
            ><template v-slot="scope">
                <span :class="scope.row.completed ? 'completed' : ''">
                    {{ scope.row.name }}
                </span>
            </template>
        </el-table-column>
        <el-table-column align="right">
            <template #header>
                <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"
                />
            </template>

            <template #default="scope">
                <template v-if="!scope.row.completed">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="handleComplete(scope)"
                        >Complete</el-button
                    >
                    <el-button size="mini" @click="handleEdit(scope)"
                        >Edit</el-button
                    >
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope)"
                        >Delete</el-button
                    >
                </template>
                <templmate v-else>
                    <img
                        style="cursor: pointer"
                        @click="handleDelete(scope)"
                        src="../assets/delete.png"
                        alt=""
                    />
                </templmate>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog
        title="提示"
        v-model="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >
        <template v-slot:default>
            <el-input
                style="width: 500px"
                v-model="nameEdit"
                placeholder="请输入内容"
            >
            </el-input>
        </template>

        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="
                        edit();
                        dialogVisible = false;
                    "
                    >确 定</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { ref, defineComponent, computed } from "vue";
import { useStore } from "../store/todo";
import { ElMessageBox } from "element-plus";
export default defineComponent({
    setup() {
        const store = useStore();
        const options = ref("all");
        const name = ref("");
        const search = ref("");
        const tableData = ref([]);
        const selectIndex = ref("");
        const nameEdit = ref("");
        let dialogVisible = ref(false);
        const add = () => {
            options.value = "all";
            if (name.value) {
                tableData.value.push({
                    name: name.value,
                    completed: false,
                });
                name.value = "";
                store.$patch({
                    allNum: tableData.value.length,
                    unCompleteNum: (store.unCompleteNum += 1),
                });
            }
        };
        const handleEdit = (scope) => {
            dialogVisible.value = true;
            nameEdit.value = scope.row.name;
            selectIndex.value = scope.$index;
        };
        const handleDelete = (scope) => {
            tableData.value.splice(scope.$index, 1);
            store.$patch({
                allNum: tableData.value.length,
                unCompleteNum:
                    store.unCompleteNum > 0 ? (store.unCompleteNum -= 1) : 0,
                completeNum:
                    store.completeNum > 0 && scope.row.completed
                        ? (store.completeNum -= 1)
                        : store.completeNum,
            });
        };
        function handleClose(done) {
            ElMessageBox.confirm("确认关闭？")
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        }
        const edit = () => {
            tableData.value[selectIndex.value].name = nameEdit.value;
        };
        const handleComplete = (scope) => {
            tableData.value[scope.$index].completed = true;
            store.$patch({
                completeNum: scope.row.completed
                    ? (store.completeNum += 1)
                    : store.completeNum,
                unCompleteNum: (store.unCompleteNum -= 1),
            });
        };
        const showComplete = () => (options.value = "completed");
        const showAll = () => (options.value = "all");
        const showNotComplete = () => (options.value = "unCompleted");
        return {
            name,
            search,
            selectIndex,
            dialogVisible,
            nameEdit,
            options,
            add,
            edit,
            handleEdit,
            handleDelete,
            handleClose,
            handleClose,
            handleComplete,
            showComplete,
            showAll,
            showNotComplete,
            store,
            completeNum: computed(() => store.completeNum),
            allNum: computed(() => store.allNum),
            unCompleteNum: computed(() => store.unCompleteNum),
            filtersTableData: computed(() => {
                if (options.value == "all") {
                    return tableData.value;
                } else if (options.value == "completed") {
                    return tableData.value.filter(
                        (item) => item.completed == true
                    );
                } else if (options.value == "unCompleted") {
                    return tableData.value.filter(
                        (item) => item.completed == false
                    );
                }
            }),
        };
    },
});
</script>

<style scoped>
.item {
    margin-top: 10px;
    margin: 0 10px;
}
.completed {
    text-decoration: line-through;
}
</style>
