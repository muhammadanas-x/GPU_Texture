#pragma once

#include "technique.h"

namespace ViewCurves
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
        ImGui::PushID("gigi_ViewCurves");

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
        {
            static const char* labels[] = {
                "F32",
                "U8",
            };
            ImGui::Combo("TextureFormat", (int*)&context->m_input.variable_TextureFormat, labels, 2);
        }
        ImGui::InputFloat("CP1", &context->m_input.variable_CP1);
        ImGui::InputFloat("CP2", &context->m_input.variable_CP2);
        ImGui::InputFloat("CP3", &context->m_input.variable_CP3);
        ImGui::InputFloat("CP4", &context->m_input.variable_CP4);
        ImGui::InputFloat("CP5", &context->m_input.variable_CP5);
        ImGui::InputFloat("CP6", &context->m_input.variable_CP6);
        ImGui::Checkbox("ShowPolynomial", &context->m_input.variable_ShowPolynomial);
        ImGui::Checkbox("ShowDeCasteljauTexture", &context->m_input.variable_ShowDeCasteljauTexture);
        ImGui::Checkbox("ShowSeilerTexture", &context->m_input.variable_ShowSeilerTexture);
        ImGui::Checkbox("ShowHybrid", &context->m_input.variable_ShowHybrid);
        ShowToolTip("de CastelJau texture, but the last lerp done in shaders at full f32 precision. Quartic and Quintic are already hybrid.");
        ImGui::Checkbox("ShowControlPoints", &context->m_input.variable_ShowControlPoints);
        ShowToolTip("In black");
        ImGui::Checkbox("ComparisonMode", &context->m_input.variable_ComparisonMode);
        ShowToolTip("Colors the output for a better comparison between two curve types");
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
        ImGui::ColorEdit3("PolynomialColor", &context->m_input.variable_PolynomialColor[0]);
        ImGui::ColorEdit3("DeCasteljauColor", &context->m_input.variable_DeCasteljauColor[0]);
        ImGui::ColorEdit3("SeilerColor", &context->m_input.variable_SeilerColor[0]);
        ImGui::ColorEdit3("HybridColor", &context->m_input.variable_HybridColor[0]);

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
