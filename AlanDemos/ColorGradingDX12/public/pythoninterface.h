#pragma once

#include "technique.h"

namespace ColorGrading
{
    inline PyObject* CurveOrdersToString(PyObject* self, PyObject* args)
    {
        int value;
        if (!PyArg_ParseTuple(args, "i:CurveOrdersToString", &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        switch((CurveOrders)value)
        {
            case CurveOrders::Linear: return Py_BuildValue("s", "Linear");
            case CurveOrders::Quadratic: return Py_BuildValue("s", "Quadratic");
            case CurveOrders::Cubic: return Py_BuildValue("s", "Cubic");
            case CurveOrders::Quartic: return Py_BuildValue("s", "Quartic");
            case CurveOrders::Quintic: return Py_BuildValue("s", "Quintic");
            default: return Py_BuildValue("s", "<invalid CurveOrders value>");
        }
    }

    inline PyObject* CurveTypesToString(PyObject* self, PyObject* args)
    {
        int value;
        if (!PyArg_ParseTuple(args, "i:CurveTypesToString", &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        switch((CurveTypes)value)
        {
            case CurveTypes::Polynomial: return Py_BuildValue("s", "Polynomial");
            case CurveTypes::TextureDeCasteljau: return Py_BuildValue("s", "TextureDeCasteljau");
            case CurveTypes::TextureSeiler: return Py_BuildValue("s", "TextureSeiler");
            default: return Py_BuildValue("s", "<invalid CurveTypes value>");
        }
    }

    inline PyObject* Set_RenderScene(PyObject* self, PyObject* args)
    {
        int contextIndex;
        bool value;

        if (!PyArg_ParseTuple(args, "ib:Set_RenderScene", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_RenderScene = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_CurveType(PyObject* self, PyObject* args)
    {
        int contextIndex;
        int value;

        if (!PyArg_ParseTuple(args, "ii:Set_CurveType", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_CurveType = (CurveTypes)value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_CurveOrder(PyObject* self, PyObject* args)
    {
        int contextIndex;
        int value;

        if (!PyArg_ParseTuple(args, "ii:Set_CurveOrder", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_CurveOrder = (CurveOrders)value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_CP1(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_CP1", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_CP1 = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_CP2(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_CP2", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_CP2 = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_CP3(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_CP3", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_CP3 = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_CP4(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_CP4", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_CP4 = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_CP5(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_CP5", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_CP5 = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_CP6(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_CP6", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_CP6 = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_RaysPerPixelPerFrame(PyObject* self, PyObject* args)
    {
        int contextIndex;
        int value;

        if (!PyArg_ParseTuple(args, "ii:Set_RaysPerPixelPerFrame", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_RaysPerPixelPerFrame = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_NormalizedCPs(PyObject* self, PyObject* args)
    {
        int contextIndex;
        bool value;

        if (!PyArg_ParseTuple(args, "ib:Set_NormalizedCPs", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_NormalizedCPs = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    static PyMethodDef pythonModuleMethods[] = {
        {"CurveOrdersToString", CurveOrdersToString, METH_VARARGS, ""},
        {"CurveTypesToString", CurveTypesToString, METH_VARARGS, ""},
        {"Set_RenderScene", Set_RenderScene, METH_VARARGS, "If true, renders a scene instead of showing an image"},
        {"Set_CurveType", Set_CurveType, METH_VARARGS, ""},
        {"Set_CurveOrder", Set_CurveOrder, METH_VARARGS, ""},
        {"Set_CP1", Set_CP1, METH_VARARGS, ""},
        {"Set_CP2", Set_CP2, METH_VARARGS, ""},
        {"Set_CP3", Set_CP3, METH_VARARGS, ""},
        {"Set_CP4", Set_CP4, METH_VARARGS, ""},
        {"Set_CP5", Set_CP5, METH_VARARGS, ""},
        {"Set_CP6", Set_CP6, METH_VARARGS, ""},
        {"Set_RaysPerPixelPerFrame", Set_RaysPerPixelPerFrame, METH_VARARGS, "Rays per pixel per frame when rendering the scene"},
        {"Set_NormalizedCPs", Set_NormalizedCPs, METH_VARARGS, "When clicked, makes a linear no-op curve out of the control points"},
        {nullptr, nullptr, 0, nullptr}
    };

    static PyModuleDef pythonModule = {
        PyModuleDef_HEAD_INIT, "ColorGrading", NULL, -1, pythonModuleMethods,
        NULL, NULL, NULL, NULL
    };

    PyObject* CreateModule()
    {
        PyObject* module = PyModule_Create(&pythonModule);
        PyModule_AddIntConstant(module, "CurveOrders_Linear", 0);
        PyModule_AddIntConstant(module, "CurveOrders_Quadratic", 1);
        PyModule_AddIntConstant(module, "CurveOrders_Cubic", 2);
        PyModule_AddIntConstant(module, "CurveOrders_Quartic", 3);
        PyModule_AddIntConstant(module, "CurveOrders_Quintic", 4);
        PyModule_AddIntConstant(module, "CurveTypes_Polynomial", 0);
        PyModule_AddIntConstant(module, "CurveTypes_TextureDeCasteljau", 1);
        PyModule_AddIntConstant(module, "CurveTypes_TextureSeiler", 2);
        return module;
    }
};
