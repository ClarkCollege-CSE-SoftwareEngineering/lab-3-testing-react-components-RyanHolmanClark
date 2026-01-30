import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchTasks, createTask, deleteTask, toggleTask } from '../api/taskApi';

describe('taskApi', () => {
    //store the original fetch
    const originalFetch = global.fetch;

    beforeEach(() => {
        // Reset fetch mock before each test
        global.fetch = vi.fn();
    })

    afterEach(() => {
        // Restore original fetch after tests
        global.fetch = originalFetch;
    })

    describe('fetchTasks', () => {
        it('returns task on successful response', async () => {
            const mockTasks = [
                { id: '1', title: 'Task 1', completed: false },
                { id: '2', title: 'Task 2', completed: true },
            ]

            vi.mocked(global.fetch).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockTasks),
            } as Response);

            const result = await fetchTasks();

            expect(result).toEqual(mockTasks);
            expect(global.fetch).toHaveBeenCalledWith('/api/tasks');
        })

        it('throws error on failed response', async () => {
            vi.mocked(global.fetch).mockResolvedValue({
                ok: false,
                status: 500,
            } as Response)

            await expect(fetchTasks()).rejects.toThrow(/failed to fetch/i)
        })
    })

    // TODO: Add tests for createTask
    // - Test successful creation (mock POST request, verify body and headers)
    // - Test error handling

    describe('createTask', () => {
        const testCreateTestData = {
            title: 'title of task',
        }
        const testTask = {
            id: 'task id',
            title: 'title of task',
            completed: false,
        }
        it('returns task on successful response', async () => {
            vi.mocked(global.fetch).mockResolvedValue({ 
                ok: true,
                json: () => Promise.resolve(testTask)
            } as Response);

            const result = await createTask(testCreateTestData)

            expect(result).toEqual(testTask);
        })

        it('throws error on failed response', async () => {

            vi.mocked(global.fetch).mockResolvedValue({ ok: false } as Response)

            await expect(createTask(testCreateTestData)).rejects.toThrow(/failed to create/i)
        })
    })

    // TODO: Add tests for deleteTask
    // - Test successful deletion (mock DELETE request)
    // - Test error handling

    describe('deleteTask', () => {
        const taskId = "id of task"

        it('exits with out an error on successful response', async () => {

            vi.mocked(global.fetch).mockResolvedValue({ ok: true } as Response);

            await deleteTask(taskId)

            expect(global.fetch).toHaveBeenCalledWith(`/api/tasks/${taskId}`, { method: 'DELETE' })
        })

        it('throws error on failed response', async () => {

            vi.mocked(global.fetch).mockResolvedValue({ ok: false } as Response)

            await expect(deleteTask(taskId)).rejects.toThrow(/failed to delete/i)
        })
    })

    // TODO: Add tests for toggleTask
    // - Test successful toggle (mock PATCH request, verify body)
    // - Test error handling    

    describe('toggleTask', () => {
        const testTask = {
            id: 'id of task',
            title: 'title of task',
            completed: true,
        }
        it('returns task on successful response', async () => {
        
            vi.mocked(global.fetch).mockResolvedValue({ 
                ok: true,
                json: () => Promise.resolve(testTask)
            } as Response);

            const result = await toggleTask(testTask.id, testTask.completed);

            expect(result).toEqual(testTask);

        })

        it('throws error on failed response', async () => {

            vi.mocked(global.fetch).mockResolvedValue({ ok: false } as Response)

            await expect(toggleTask(testTask.id, testTask.completed)).rejects.toThrow(/failed to update/i)
        })
    })
})