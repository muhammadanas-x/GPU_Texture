#pragma once

#include "technique.h"

namespace ColorGrading
{
    inline void ShowToolTip(const char* tooltip)
    {
        if (!tooltip || !tooltip[0])
            return;

        ImGui::SameLine();
        ImGui::PushStyleColor(ImGuiCol_Text, IM_COL32(255, 255, 0, 255));
        ImGui::Text("[?]");
        ImGui::PopStyleColor();
        if (ImGui::IsItemHovered(ImGuiHoveredFlags_AllowWhenDisabled))
            ImGui::SetTooltip("%s", tooltip);
    }

    void MakeUI(Context* context, ID3D12CommandQueue* commandQueue)
    {
        ImGui::PushID("gigi_ColorGrading");

        {
            float width = ImGui::GetContentRegionAvail().x / 4.0f;
            ImGui::PushID("RenderSize");
            ImGui::PushItemWidth(width);
            int localVarX = (int)context->m_input.variable_RenderSize[0];
            if(ImGui::InputInt("##X", &localVarX, 0))
                context->m_input.variable_RenderSize[0] = (unsigned int)localVarX;
            ImGui::SameLine();
            int localVarY = (int)context->m_input.variable_RenderSize[1];
            if(ImGui::InputInt("##Y", &localVarY, 0))
                context->m_input.variable_RenderSize[1] = (unsigned int)localVarY;
            ImGui::SameLine();
            ImGui::Text("RenderSize");
            ImGui::PopItemWidth();
            ImGui::PopID();
        }
        {
            static const char* labels[] = {
                "Polynomial",
                "TextureDeCasteljau",
                "TextureSeiler",
            };
            ImGui::Combo("CurveType", (int*)&context->m_input.variable_CurveType, labels, 3);
        }
        {
            static const char* labels[] = {
                "Linear",
                "Quadratic",
                "Cubic",
                "Quartic",
                "Quintic",
            };
            ImGui::Combo("CurveOrder", (int*)&context->m_input.variable_CurveOrder, labels, 5);
        }
        ImGui::ColorEdit3("CP1", &context->m_input.variable_CP1[0]);
        ImGui::ColorEdit3("CP2", &context->m_input.variable_CP2[0]);
        ImGui::ColorEdit3("CP3", &context->m_input.variable_CP3[0]);
        ImGui::ColorEdit3("CP4", &context->m_input.variable_CP4[0]);
        ImGui::ColorEdit3("CP5", &context->m_input.variable_CP5[0]);
        ImGui::ColorEdit3("CP6", &context->m_input.variable_CP6[0]);
        ImGui::InputInt("RaysPerPixelPerFrame", &context->m_input.variable_RaysPerPixelPerFrame, 0);
        ShowToolTip("Rays per pixel per frame when rendering the scene");
        {
            static const char* labels[] = {
                "EveryRay",
                "OncePerFrame",
            };
            ImGui::Combo("ColorGrade", (int*)&context->m_input.variable_ColorGrade, labels, 2);
            ShowToolTip("Should the color grading happen once per frame, or with every ray?");
        }
        context->m_input.variable_NormalizedCPs = ImGui::Button("NormalizedCPs");
        ShowToolTip("When clicked, makes a linear no-op curve out of the control points");
        context->m_input.variable_ResetAccumulation = ImGui::Button("ResetAccumulation");

        ImGui::Checkbox("Profile", &context->m_profile);
        if (context->m_profile)
        {
            int numEntries = 0;
            const ProfileEntry* entries = context->ReadbackProfileData(commandQueue, numEntries);
            if (ImGui::BeginTable("profiling", 3, ImGuiTableFlags_Borders | ImGuiTableFlags_RowBg))
            {
                ImGui::TableSetupColumn("Label");
                ImGui::TableSetupColumn("CPU ms");
                ImGui::TableSetupColumn("GPU ms");
                ImGui::TableHeadersRow();
                float totalCpu = 0.0f;
                float totalGpu = 0.0f;
                for (int entryIndex = 0; entryIndex < numEntries; ++entryIndex)
                {
                    ImGui::TableNextRow();
                    ImGui::TableNextColumn();
                    ImGui::TextUnformatted(entries[entryIndex].m_label);
                    ImGui::TableNextColumn();
                    ImGui::Text("%0.3f", entries[entryIndex].m_cpu * 1000.0f);
                    ImGui::TableNextColumn();
                    ImGui::Text("%0.3f", entries[entryIndex].m_gpu * 1000.0f);
                    totalCpu += entries[entryIndex].m_cpu;
                    totalGpu += entries[entryIndex].m_gpu;
                }
                ImGui::EndTable();
            }
        }

        ImGui::PopID();
    }
};
