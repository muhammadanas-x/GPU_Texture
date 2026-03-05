#pragma once

#include "technique.h"

namespace ViewCurves
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

    inline PyObject* TextureFormatsToString(PyObject* self, PyObject* args)
    {
        int value;
        if (!PyArg_ParseTuple(args, "i:TextureFormatsToString", &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        switch((TextureFormats)value)
        {
            case TextureFormats::F32: return Py_BuildValue("s", "F32");
            case TextureFormats::U8: return Py_BuildValue("s", "U8");
            default: return Py_BuildValue("s", "<invalid TextureFormats value>");
        }
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

    inline PyObject* Set_TextureFormat(PyObject* self, PyObject* args)
    {
        int contextIndex;
        int value;

        if (!PyArg_ParseTuple(args, "ii:Set_TextureFormat", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_TextureFormat = (TextureFormats)value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_CP1(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float value;

        if (!PyArg_ParseTuple(args, "if:Set_CP1", &contextIndex, &value))
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
        float value;

        if (!PyArg_ParseTuple(args, "if:Set_CP2", &contextIndex, &value))
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
        float value;

        if (!PyArg_ParseTuple(args, "if:Set_CP3", &contextIndex, &value))
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
        float value;

        if (!PyArg_ParseTuple(args, "if:Set_CP4", &contextIndex, &value))
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
        float value;

        if (!PyArg_ParseTuple(args, "if:Set_CP5", &contextIndex, &value))
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
        float value;

        if (!PyArg_ParseTuple(args, "if:Set_CP6", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_CP6 = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_ShowPolynomial(PyObject* self, PyObject* args)
    {
        int contextIndex;
        bool value;

        if (!PyArg_ParseTuple(args, "ib:Set_ShowPolynomial", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_ShowPolynomial = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_ShowDeCasteljauTexture(PyObject* self, PyObject* args)
    {
        int contextIndex;
        bool value;

        if (!PyArg_ParseTuple(args, "ib:Set_ShowDeCasteljauTexture", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_ShowDeCasteljauTexture = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_ShowSeilerTexture(PyObject* self, PyObject* args)
    {
        int contextIndex;
        bool value;

        if (!PyArg_ParseTuple(args, "ib:Set_ShowSeilerTexture", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_ShowSeilerTexture = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_ShowHybrid(PyObject* self, PyObject* args)
    {
        int contextIndex;
        bool value;

        if (!PyArg_ParseTuple(args, "ib:Set_ShowHybrid", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_ShowHybrid = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_ShowControlPoints(PyObject* self, PyObject* args)
    {
        int contextIndex;
        bool value;

        if (!PyArg_ParseTuple(args, "ib:Set_ShowControlPoints", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_ShowControlPoints = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_ComparisonMode(PyObject* self, PyObject* args)
    {
        int contextIndex;
        bool value;

        if (!PyArg_ParseTuple(args, "ib:Set_ComparisonMode", &contextIndex, &value))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_ComparisonMode = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_RenderSize(PyObject* self, PyObject* args)
    {
        int contextIndex;
        uint2 value;

        if (!PyArg_ParseTuple(args, "iII:Set_RenderSize", &contextIndex, &value[0], &value[1]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_RenderSize = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_PolynomialColor(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_PolynomialColor", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_PolynomialColor = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_DeCasteljauColor(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_DeCasteljauColor", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_DeCasteljauColor = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_SeilerColor(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_SeilerColor", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_SeilerColor = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    inline PyObject* Set_HybridColor(PyObject* self, PyObject* args)
    {
        int contextIndex;
        float3 value;

        if (!PyArg_ParseTuple(args, "ifff:Set_HybridColor", &contextIndex, &value[0], &value[1], &value[2]))
            return PyErr_Format(PyExc_TypeError, "type error");

        Context* context = Context::GetContext(contextIndex);
        if (!context)
            return PyErr_Format(PyExc_IndexError, __FUNCTION__, "() : index % i is out of range(count = % i)", contextIndex, Context::GetContextCount());

        context->m_input.variable_HybridColor = value;

        Py_INCREF(Py_None);
        return Py_None;
    }

    static PyMethodDef pythonModuleMethods[] = {
        {"CurveOrdersToString", CurveOrdersToString, METH_VARARGS, ""},
        {"TextureFormatsToString", TextureFormatsToString, METH_VARARGS, ""},
        {"Set_CurveOrder", Set_CurveOrder, METH_VARARGS, ""},
        {"Set_TextureFormat", Set_TextureFormat, METH_VARARGS, ""},
        {"Set_CP1", Set_CP1, METH_VARARGS, ""},
        {"Set_CP2", Set_CP2, METH_VARARGS, ""},
        {"Set_CP3", Set_CP3, METH_VARARGS, ""},
        {"Set_CP4", Set_CP4, METH_VARARGS, ""},
        {"Set_CP5", Set_CP5, METH_VARARGS, ""},
        {"Set_CP6", Set_CP6, METH_VARARGS, ""},
        {"Set_ShowPolynomial", Set_ShowPolynomial, METH_VARARGS, ""},
        {"Set_ShowDeCasteljauTexture", Set_ShowDeCasteljauTexture, METH_VARARGS, ""},
        {"Set_ShowSeilerTexture", Set_ShowSeilerTexture, METH_VARARGS, ""},
        {"Set_ShowHybrid", Set_ShowHybrid, METH_VARARGS, "de CastelJau texture, but the last lerp done in shaders at full f32 precision. Quartic and Quintic are already hybrid."},
        {"Set_ShowControlPoints", Set_ShowControlPoints, METH_VARARGS, "In black"},
        {"Set_ComparisonMode", Set_ComparisonMode, METH_VARARGS, "Colors the output for a better comparison between two curve types"},
        {"Set_RenderSize", Set_RenderSize, METH_VARARGS, ""},
        {"Set_PolynomialColor", Set_PolynomialColor, METH_VARARGS, ""},
        {"Set_DeCasteljauColor", Set_DeCasteljauColor, METH_VARARGS, ""},
        {"Set_SeilerColor", Set_SeilerColor, METH_VARARGS, ""},
        {"Set_HybridColor", Set_HybridColor, METH_VARARGS, ""},
        {nullptr, nullptr, 0, nullptr}
    };

    static PyModuleDef pythonModule = {
        PyModuleDef_HEAD_INIT, "ViewCurves", NULL, -1, pythonModuleMethods,
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
        PyModule_AddIntConstant(module, "TextureFormats_F32", 0);
        PyModule_AddIntConstant(module, "TextureFormats_U8", 1);
        return module;
    }
};
